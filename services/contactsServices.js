import { Contact } from "../models/Contact.js";

export const listContacts = async () => {
  return await Contact.findAll();
};

export const getContactById = async (contactId) => {
  return await Contact.findByPk(contactId);
};

export const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
};

export const addContact = async (name, email, phone) => {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
};

export const updateContact = async (contactId, updatedData) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.update(updatedData);
  return contact;
};

export const updateStatusContact = async (contactId, body) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  contact.favorite = body.favorite;
  await contact.save();
  return contact;
};
