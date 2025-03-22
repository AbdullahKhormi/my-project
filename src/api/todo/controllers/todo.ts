// src/api/todo/controllers/todo.ts

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
  async sendEmail(ctx: Context) {
    const { to, subject, text, html } = ctx.request.body;

    if (!to || !subject || !text) {
      return ctx.badRequest('Missing required fields: to, subject, or text');
    }

    try {
      await strapi.plugins['email'].services.email.send({
        to: to,
        subject: subject,
        text: text,
        html: html,  // تأكد من أنك تدعم الـ HTML إذا كان متاحًا
      });

      return ctx.send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return ctx.internalServerError('Error sending email');
    }
  },
}));
