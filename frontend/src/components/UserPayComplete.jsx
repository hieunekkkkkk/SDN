import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserPayComplete = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndUpdatePlan = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/payment/userid/${user.id}`);
        const payments = response.data.data || [];

        const completedPayment = payments.find(payment => payment.payment_status === 'completed');
        if (!completedPayment) {
          console.warn('No completed payment found.');
          navigate('/business-registration');
          return;
        }

        const userPlan = user.unsafeMetadata?.userPlan
        
        const newUserPlan = {
          ...userPlan,
          stackId: completedPayment.payment_stack._id,
          date: completedPayment.payment_date,
          planNotified: false,
        };

        const currentUserPlan = user.unsafeMetadata?.userPlan;
        console.log(currentUserPlan);
        
        const isSamePlan =
          currentUserPlan?.stackId === newUserPlan.stackId &&
          currentUserPlan?.date === newUserPlan.date;

        if (!isSamePlan) {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              userPlan: newUserPlan,
            },
          });
        }

        navigate('/business-registration');
      } catch (err) {
        console.error('Error verifying payment and updating plan:', err);
      }
    };

    verifyAndUpdatePlan();
  }, [user, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Đang xác nhận thanh toán...</h2>
    </div>
  );
};

export default UserPayComplete;
