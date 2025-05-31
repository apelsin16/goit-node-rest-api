import HttpError from "../helpers/HttpError.js";
import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact as updateContactService
} from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const contact = await getContactById(req.params.id);
        if (!contact) {
            throw HttpError(404);
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const removed = await removeContact(req.params.id);
        if (!removed) {
            throw HttpError(404);
        }
        res.status(200).json(removed);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const fields = Object.keys(req.body);
        if (fields.length === 0) {
            throw HttpError(400, "Body must have at least one field");
        }

        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const updated = await updateContactService(req.params.id, req.body);
        if (!updated) {
            throw HttpError(404);
        }

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};
