import type { IEmail } from '~/types/contact';

export const ContactsApi = {
  async sendEMail(body: IEmail): Promise<{ success: boolean }> {
    return await $fetch('/api/contact', {
      method: 'POST',
      body,
    });
  },
};
