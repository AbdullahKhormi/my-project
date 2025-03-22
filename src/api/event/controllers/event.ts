import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    // التأكد من وجود userId في الـ JWT
    const userId = ctx.state.user ? ctx.state.user.id : null;
    if (!userId) {
      return ctx.unauthorized('You are not authenticated');
    }

    // البحث عن الحدث بناءً على الـ id و userId
    const entity = await strapi.db.query('api::event.event').findOne({
      where: {
        id,
         // التأكد من أن الحدث ينتمي للمستخدم الحالي
      },
      populate: ['user'],  // إذا كنت بحاجة لربط بيانات المستخدم بالحدث
    });

    // في حالة عدم العثور على الحدث أو أن المستخدم ليس لديه صلاحية للوصول إليه
    if (!entity) {
      return ctx.notFound('Event not found or you are not authorized to access this event');
    }

    // إرجاع النتيجة بعد تحويلها
    return this.transformResponse(entity);
  }
,

  // دالة التحديث
  async update(ctx) {
    const { id } = ctx.params;

    // الحصول على userId من الـ JWT
    const userId = ctx.state.user.id;

    // تحقق من وجود الحدث للمستخدم الحالي
    const entity = await strapi.db.query('api::event.event').findOne({
      where: {
        id,
        user: userId,  // تأكد من أن الحدث ينتمي للمستخدم الحالي
      },
    });

    if (!entity) {
      return ctx.notFound('Event not found or you are not authorized to update this event');
    }

    // تحديث البيانات
    const updatedData = ctx.request.body.data;

    const updatedEntity = await strapi.db.query('api::event.event').update({
      where: { id },
      data: updatedData,
    });

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
      return ctx.notFound('Post not found');
    }

    try {
      // تسجيل قبل تنفيذ الحذف
      console.log(`Attempting to delete post with ID: ${id}`);

      // تنفيذ عملية الحذف
      await strapi.db.query('api::event.event').delete({
        where: { id },
      });

      // تسجيل بعد تنفيذ الحذف
      console.log(`Post with ID: ${id} has been deleted`);

    } catch (error) {
      console.error("Error during delete:", error);
      return ctx.internalServerError('Error deleting post');
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
