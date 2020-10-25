import React, { useState, useEffect } from 'react';

import Layout from 'components/Layout';
import PaymentList from 'components/PaymentList';
import PaymentModal from 'components/Modal/PaymentModal';

import PaymentSlip from 'repository/PaymentSlip';
import APIService from 'services/api';
import { useAuth } from 'hooks/auth';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentSlip[]>([]);
  const [showModalPayment, setShowPaymentModal] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState<PaymentSlip>(
    {} as PaymentSlip
  );

  const { getSession } = useAuth();

  const getPayments = async () => {
    const user = getSession();
    const allPayments = await APIService.getPaymentsByUser(user.id);
    allPayments.sort((paymentA, paymentB) => {
      if (paymentA.paid) {
        return 1;
      }

      if (paymentB.paid) {
        return -1;
      }

      return 0;
    });
    setPayments(allPayments);
  };

  useEffect(() => {
    getPayments();
  }, []);

  function showPaymentModal(payment: PaymentSlip) {
    setPaymentSelected(payment);
    setShowPaymentModal(true);
  }

  function hidePaymentModal() {
    setShowPaymentModal(false);
  }

  function confirmPayment() {
    getPayments();
    hidePaymentModal();
  }

  return (
    <Layout>
      <PaymentList
        payments={payments}
        onClick={payment => showPaymentModal(payment)}
      />
      <PaymentModal
        onCancel={hidePaymentModal}
        onConfirm={confirmPayment}
        visible={showModalPayment}
        paymentSlip={paymentSelected}
      />
    </Layout>
  );
};

export default Payments;
