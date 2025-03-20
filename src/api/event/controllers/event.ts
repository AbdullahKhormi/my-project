import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  // دالة العثور على منشور واحد
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.db.query('api::event.event').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('event not found');
    }

    return this.transformResponse(entity);
  },

  // دالة التحديث
  async update(ctx) {
    const { id } = ctx.params;

    // تأكد من أن العنصر موجود
    const entity = await strapi.db.query('api::event.event').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('event not found');
    }

    // هنا يمكنك تحديد البيانات التي سيتم تحديثها
    const updatedData = ctx.request.body.data;

    // تحديث الكائن
    const updatedEntity = await strapi.db.query('api::event.event').update({
      where: { id },
      data: updatedData,
    });

    // إرجاع الكائن المحدث
    return this.transformResponse(updatedEntity);
  },

  // دالة الحذف
  async delete(ctx) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.badRequest('ID is required');
    }

    // تحقق من وجود العنصر قبل الحذف
    const entity = await strapi.db.query('api::event.event').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('event not found');
    }

    try {
      // تسجيل قبل تنفيذ الحذف
      console.log(`Attempting to delete event with ID: ${id}`);

      // تنفيذ عملية الحذف
      await strapi.db.query('api::event.event').delete({
        where: { id },
      });

      // تسجيل بعد تنفيذ الحذف
      console.log(`event with ID: ${id} has been deleted`);

    } catch (error) {
      console.error("Error during delete:", error);
      return ctx.internalServerError('Error deleting event');
    }

    return ctx.noContent(); // الحذف تم بنجاح
  },

  // دالة لإرسال البريد الإلكتروني
  async sendEmail(ctx) {
    const { email, subject, message } = ctx.request.body;

    // التأكد من وجود القيم المطلوبة
    if (!email || !subject || !message) {
      return ctx.badRequest('Missing required fields: email, subject, or message');
    }

    try {
      // إرسال البريد الإلكتروني باستخدام خدمة البريد الإلكتروني في Strapi
      await strapi.plugins['email'].services.email.send({
        to: email, // المستقبل
        subject: subject, // العنوان
        text: message, // المحتوى
      });

      return ctx.send({ message: 'Email sent successfully' });
    } catch (err) {
      console.error('Failed to send email', err);
      return ctx.internalServerError('Failed to send email');
    }
  },
}));
