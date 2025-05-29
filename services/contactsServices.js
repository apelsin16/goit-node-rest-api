import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

export async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);
        return contacts;
    } catch (err) {
        console.error('Error reading contacts:', err.message);
        return [];
    }
}

export async function getContactById(contactId) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);
        const contact = contacts.find(contact => contact.id === contactId);
        return contact || null;
    } catch (err) {
        console.error('Error reading contact:', err.message);
        return [];
    }
}

export async function removeContact(contactId) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);

        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index === -1) {
            return null;
        }

        const [removedContact] = contacts.splice(index, 1);

        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');

        return removedContact;
    } catch (err) {
        console.error('Error removing contact:', err.message);
        return null;
    }
}

export async function addContact(name, email, phone) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);

        const newContact = {
            id: uuidv4(),
            name,
            email,
            phone
        };

        contacts.push(newContact);

        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');

        return newContact;
    } catch (err) {
        console.error('Error adding contact:', err.message);
        return null;
    }
}

export async function updateContact(id, updatedData) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null;
    }

    contacts[index] = { ...contacts[index], ...updatedData };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return contacts[index];
}