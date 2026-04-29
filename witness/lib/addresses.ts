export type AddressInput = {
  label?: string;
  recipient_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  is_default?: boolean;
};

export type NormalizedAddressInput = {
  label: string | null;
  recipient_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

function clean(value: string | undefined) {
  return (value ?? "").trim();
}

export function normalizeAddressInput(input: AddressInput): NormalizedAddressInput {
  const country = clean(input.country) || "United States";
  return {
    label: clean(input.label) || null,
    recipient_name: clean(input.recipient_name),
    address_line1: clean(input.address_line1),
    address_line2: clean(input.address_line2) || null,
    city: clean(input.city),
    state: clean(input.state),
    postal_code: clean(input.postal_code),
    country,
    phone: clean(input.phone) || null,
    is_default: input.is_default === true,
  };
}

export function validateAddressInput(address: NormalizedAddressInput) {
  if (!address.recipient_name) return "Recipient name is required.";
  if (!address.address_line1) return "Address line 1 is required.";
  if (!address.city) return "City is required.";
  if (!address.state) return "State is required.";
  if (!address.postal_code) return "ZIP/postal code is required.";
  if (!address.country) return "Country is required.";
  return null;
}

export function formatShippingSummary(address: {
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}) {
  return [address.address_line1, address.city, address.state, address.postal_code, address.country]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}
