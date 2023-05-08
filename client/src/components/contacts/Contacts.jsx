import { useState } from "react";
import useHttp from "../../hooks/use-http";
import { getUserData } from "../../utilities/authentication";
import constants from "../../utilities/constants";
import Query from "../query/Query";
import ContactRow from "./ContactRow";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./Contacts.module.css";

const Contacts = (props) => {
  const data = props.data;
  const { token } = getUserData();
  const [contacts, setContacts] = useState(data.contacts);
  const [total, setTotal] = useState(data.total);
  const [pagesNumber, setPagesNumber] = useState(data.pagesNumber);

  const { isLoading, sendRequest } = useHttp();

  const completeLoading = (data) => {
    const { contacts, total, pagesNumber } = data;
    setContacts(contacts);
    setTotal(total);
    setPagesNumber(pagesNumber);
  };

  const loadContacts = (data) => {
    const { search, page, limit } = data;
    const orderBy = data.orderBy.value;

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getContacts`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ search, page, limit, orderBy })
      },
      completeLoading
    );
  };

  const completeDeletion = (contactId) => {
    setContacts((previousContacts) => {
      const updatedContacts = previousContacts.filter((contact) => contact._id !== contactId);
      return [...updatedContacts];
    });
    setTotal((previousTotal) => {
      return --previousTotal;
    });
  };

  return (
    <div className={`${style.contacts} ${style.position}`}>
      <h1 className={style.center}>Contacts</h1>
      <Query type={constants.CONTACTS_PAGE} total={total} pagesNumber={pagesNumber} isLoading={isLoading} onLoadValues={loadContacts}>
        {contacts.length ? (
          contacts.map((contact) =>
            <ContactRow key={contact._id} contact={contact} onCompleteDeletion={completeDeletion} />
          )
        ) : (
          <EmptyValuesLayout message="No contacts found!" />
        )}
      </Query>
    </div>
  );
};

export default Contacts;
