import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/Contact.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema
} from "../schemas/contactsSchemas.js";

// GET /api/contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    await contact.destroy();
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    await contact.update(req.body);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contacts/:id/favorite

export const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { favorite } = req.body;
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    contact.favorite = favorite;
    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
