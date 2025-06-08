'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import { useProfile } from "@/components/UseProfile";
import { useState } from "react";

export default function UserForm({ user, onSave }) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const { data: loggedInUserData } = useProfile();
  const [isNumeric, setIsNumeric] = useState(false);
  const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);


  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
    if (propName === 'country') setCountry(value);
  }
  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev => {
          if (userName.trim() === '') {
            ev.preventDefault();
            setIsUserNameEmpty(true);
          } else {
            onSave(ev, {
              name: userName, image, phone, admin,
              streetAddress, city, country, postalCode,
            });
          }
        }}
      >
        <label>
          {"Tên"}
        </label>
        <input
          type="text"
          placeholder="First and last name"
          value={userName}
          onChange={ev => {
            const value = ev.target.value;
            if (/\d/.test(value)) {
              setIsNumeric(true);
            } else {
              setIsNumeric(false);
              if (value.length <= 30 && /^[\p{L}\s]*$/u.test(value)) {
                setUserName(value);
              }
            }
            if (value.length > 0) {
              setIsUserNameEmpty(false);
            }
          }}
        />
        {isNumeric &&
          <p className="text-red-500">Đừng nhập số.</p>}
        {isUserNameEmpty &&
          <p className="text-red-500">Hãy nhập tên.</p>}
        <label>Email</label>
        <input
          type="email"
          disabled={true}
          value={user.email}
          placeholder={'email'}
        />
        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />
        {loggedInUserData.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" className="" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}