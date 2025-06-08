import { useState } from 'react';

export default function AddressInputs({ addressProps, setAddressProp, disabled = false }) {
  const { phone, streetAddress, postalCode, city, country } = addressProps;
  const [isChar, setIsChar] = useState(false);
  return (
    <>
      <label>Điện thoại</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Phone number"
        value={phone || ''}
        onChange={ev => {
          const value = ev.target.value;
          const pureNumbers = value.replace('+', '');
          if (value === '' || (pureNumbers.length <= 11 && /^(\+)?[0-9]*$/.test(value))) {
            setAddressProp('phone', value);
            setIsChar(false);
          } else {
            setIsChar(true);
          }
        }}
      />
      {isChar &&
          <p className="text-red-500">Điện thoại không hợp lệ.</p>}


      <label>{"Địa chỉ nhà"}</label>
      <input
        disabled={disabled}
        type="text" placeholder="Street address"
        value={streetAddress || ''} onChange={ev => setAddressProp('streetAddress', ev.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Mã bưu thiếp</label>
          <input
            disabled={disabled}
            type="text" placeholder="Postal code"
            value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>Thành phố</label>
          <input
            disabled={disabled}
            type="text" placeholder="City"
            value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
          />
        </div>
      </div>
      <label>Quốc gia</label>
      <input
        disabled={disabled}
        type="text" placeholder="Country"
        value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
      />
    </>
  );
}