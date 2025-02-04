import emailjs from 'emailjs-com';
import status from 'http-status';
import config from '../config';
import AppError from './AppError';

const sendOtpEmail = (email: string, otp: string, username: string) => {
  const templateParams = {
    to_email: email,
    otp: otp,
    user_name: username,
  };

  emailjs
    .send(
      config.email.service_id as string,
      config.email.template_id as string,
      templateParams
    )
    .then((response) => {
      console.log('Email sent successfully', response);
    })
    .catch((error) => {
      console.error('Failed to send email', error);
      throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
    });
};

export default sendOtpEmail;
