import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  // دالة العثور على منشور واحد
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.db.query('api::post.post').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('Post not found');
    }

    return this.transformResponse(entity);
  },

  // دالة التحديث
  async update(ctx) {
    const { id } = ctx.params;

    // تأكد من أن العنصر موجود
    const entity = await strapi.db.query('api::post.post').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('Post not found');
    }

    // هنا يمكنك تحديد البيانات التي سيتم تحديثها
    const updatedData = ctx.request.body.data;

    // تحديث الكائن
    const updatedEntity = await strapi.db.query('api::post.post').update({
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
    const entity = await strapi.db.query('api::post.post').findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('Post not found');
    }

    try {
      // تسجيل قبل تنفيذ الحذف
      console.log(`Attempting to delete post with ID: ${id}`);

      // تنفيذ عملية الحذف
      await strapi.db.query('api::post.post').delete({
        where: { id },
      });

      // تسجيل بعد تنفيذ الحذف
      console.log(`Post with ID: ${id} has been deleted`);

    } catch (error) {
      console.error("Error during delete:", error);
      return ctx.internalServerError('Error deleting post');
    }

    return ctx.noContent(); // الحذف تم بنجاح
  }

}));
