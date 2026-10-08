import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Minus,
  Phone,
  User,
  Mail,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

import { menuCategories, type MenuItem } from "../content/menu";

type CartItem = MenuItem & {
  quantity: number;
};

type OrderNowModalProps = {
  cart: CartItem[];
  open: boolean;
  onClose: () => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemName: string, quantity: number) => void;
  onRemoveItem: (itemName: string) => void;
};

type OrderForm = {
  fulfillment: "delivery" | "pickup";
  address: string;
  name: string;
  phone: string;
  email: string;
  requests: string;
};

type Step = "order" | "details" | "review";

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "integration";

const initialForm: OrderForm = {
  fulfillment: "delivery",
  address: "",
  name: "",
  phone: "",
  email: "",
  requests: "",
};

const integrationMessage =
  "You're viewing a website template. Online ordering will be available once the live website is connected to the restaurant's booking system.";

export default function OrderNowModal({
  cart,
  open,
  onClose,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
}: OrderNowModalProps) {
  const [step, setStep] = useState<Step>("order");
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [addMoreOpen, setAddMoreOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    setStep("order");
    setForm(initialForm);
    setStatus("idle");
    setErrorMessage("");
    setAddMoreOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (addMoreOpen) {
          setAddMoreOpen(false);
          return;
        }

        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose, addMoreOpen]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.priceValue * item.quantity,
        0
      ),
    [cart]
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const deliveryFee = form.fulfillment === "delivery" ? 300 : 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (value: number) =>
    `${value.toLocaleString("en-KE")}/=`;

  const updateForm = <K extends keyof OrderForm>(
    field: K,
    value: OrderForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleContinueToDetails = () => {
    if (cart.length === 0) return;
    setAddMoreOpen(false);
    setStep("details");
  };

  const handleContinueToReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("review");
  };

  const handleAddItem = (item: MenuItem) => {
    onAddItem(item);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            category: item.category,
            name: item.name,
            price: item.priceValue,
            quantity: item.quantity,
          })),
          fulfillment: form.fulfillment,
          address: form.address,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
          },
          requests: form.requests,
          subtotal,
          deliveryFee,
          total,
        }),
      });

      if (response.status === 404 || response.status === 405) {
        setStatus("integration");
        setErrorMessage(integrationMessage);
        return;
      }

      const responseText = await response.text();

      let data: {
        message?: string;
        error?: string;
      } = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          setStatus("integration");
          setErrorMessage(integrationMessage);
          return;
        }
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.message ||
            data.error ||
            "We couldn't process your order. Please try again."
        );
        return;
      }

      setStatus("success");
    } catch {
      setStatus("integration");
      setErrorMessage(integrationMessage);
    }
  };

  if (!open || cart.length === 0) return null;

  const addedItemNames = new Set(cart.map((item) => item.name));
  const allMenuItems = menuCategories.flatMap((category) => category.items);

  return (
    <div
      className="reservation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-now-title"
    >
      <button
        type="button"
        className="reservation-modal__backdrop"
        aria-label="Close order"
        onClick={onClose}
      />

      <div className="reservation-modal__panel order-modal__panel">
        <button
          type="button"
          className="reservation-modal__close"
          onClick={onClose}
          aria-label="Close order"
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="reservation-success">
            <div className="reservation-success__icon">
              <Check size={24} />
            </div>

            <p className="eyebrow">Order received</p>

            <h2>
              Thank you,
              <br />
              {form.name}.
            </h2>

            <p>
              We've received your order containing {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}.
            </p>

            <p>
              We'll contact you at {form.phone} or {form.email} with the next
              steps.
            </p>

            <button
              type="button"
              className="button button--dark"
              onClick={onClose}
            >
              Done
              <Check size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="reservation-modal__header">
              <p className="eyebrow">
                {step === "order" && "01 · Your order"}
                {step === "details" && "02 · Delivery details"}
                {step === "review" && "03 · Review & checkout"}
              </p>

              <h2 id="order-now-title">
                {step === "order" && "Order your"}
                {step === "details" && "Where should we"}
                {step === "review" && "Ready to"}
                <em>
                  {step === "order" && "favourites."}
                  {step === "details" && "deliver?"}
                  {step === "review" && "checkout?"}
                </em>
              </h2>
            </div>

            {step === "order" && (
              <div className="order-modal__content">
                <div className="order-cart">
                  {cart.map((item) => (
                    <div className="order-item" key={item.name}>
                      <div className="order-item__image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="order-item__copy">
                        <span>{item.category}</span>

                        <h3>{item.name}</h3>

                        <strong>{item.price}</strong>

                        <div className="order-quantity">
                          <span>Quantity</span>

                          <div className="order-quantity__controls">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() =>
                                onUpdateQuantity(
                                  item.name,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity === 1}
                            >
                              <Minus size={15} />
                            </button>

                            <strong>{item.quantity}</strong>

                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() =>
                                onUpdateQuantity(
                                  item.name,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="order-item__remove"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => onRemoveItem(item.name)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="order-add-more"
                  onClick={() => setAddMoreOpen(true)}
                >
                  <span>
                    <Plus size={16} />
                    Add more items to your order
                  </span>
                  <ArrowRight size={16} />
                </button>

                <div className="order-fulfillment">
                  <span className="order-form__label">
                    How would you like your order?
                  </span>

                  <div className="order-fulfillment__options">
                    <button
                      type="button"
                      className={
                        form.fulfillment === "delivery"
                          ? "order-fulfillment__option is-active"
                          : "order-fulfillment__option"
                      }
                      onClick={() =>
                        updateForm("fulfillment", "delivery")
                      }
                    >
                      <MapPin size={17} />
                      <span>
                        <strong>Delivery</strong>
                        <small>We'll bring it to you</small>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        form.fulfillment === "pickup"
                          ? "order-fulfillment__option is-active"
                          : "order-fulfillment__option"
                      }
                      onClick={() => updateForm("fulfillment", "pickup")}
                    >
                      <ShoppingBag size={17} />
                      <span>
                        <strong>Pickup</strong>
                        <small>Collect from Alora Kitchen</small>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="order-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>
                      {deliveryFee === 0
                        ? "Free"
                        : formatPrice(deliveryFee)}
                    </strong>
                  </div>

                  <div className="order-summary__total">
                    <span>Total</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="button button--dark"
                  onClick={handleContinueToDetails}
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === "details" && (
              <form
                className="reservation-form"
                onSubmit={handleContinueToReview}
              >
                
                {form.fulfillment === "delivery" && (
                  <label className="reservation-form__field">
                    <span>
                      <MapPin size={17} />
                      Delivery location
                    </span>

                    <div className="reservation-form__input-wrap">
                      <input
                        type="text"
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                        placeholder="Enter your delivery address"
                        required
                      />
                    </div>
                  </label>
                )}

                <label className="reservation-form__field">
                  <span>
                    <User size={17} />
                    Your name
                  </span>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Full name"
                    required
                  />
                </label>

                <label className="reservation-form__field">
                  <span>
                    <Phone size={17} />
                    Phone number
                  </span>

                  <div className="reservation-form__input-wrap">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateForm("phone", event.target.value)
                      }
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                </label>

                <label className="reservation-form__field">
                  <span>
                    <Mail size={17} />
                    Email address
                  </span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateForm("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="reservation-form__field">
                  <span>Special requests</span>

                  <textarea
                    value={form.requests}
                    onChange={(event) =>
                      updateForm("requests", event.target.value)
                    }
                    placeholder="Dietary requirements or anything else we should know"
                    rows={3}
                  />
                </label>

                <div className="order-form__actions">
                  <button
                    type="button"
                    className="button button--light"
                    onClick={() => setStep("order")}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>

                  <button
                    type="submit"
                    className="button button--dark"
                  >
                    Review order
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {step === "review" && (
              <form
                className="reservation-form"
                onSubmit={handleSubmit}
              >
                <div className="order-review">
                  <div className="order-review__items">
                    {cart.map((item) => (
                      <div className="order-review__item" key={item.name}>
                        <img src={item.image} alt={item.name} />

                        <div>
                          <span>{item.category}</span>
                          <h3>{item.name}</h3>
                          <p>
                            {item.quantity}{" "}
                            {item.quantity === 1 ? "item" : "items"}
                          </p>
                        </div>

                        <strong>
                          {formatPrice(item.priceValue * item.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-review__details">
                    <div>
                      <span>
                        {form.fulfillment === "delivery"
                          ? "Delivery to"
                          : "Pickup"}
                      </span>

                      <strong>
                        {form.fulfillment === "delivery"
                          ? form.address
                          : "Alora Kitchen"}
                      </strong>
                    </div>

                    <div>
                      <span>Customer</span>
                      <strong>{form.name}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{form.phone}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{form.email}</strong>
                    </div>
                  </div>

                  <div className="order-summary">
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>

                    <div>
                      <span>Delivery</span>
                      <strong>
                        {deliveryFee === 0
                          ? "Free"
                          : formatPrice(deliveryFee)}
                      </strong>
                    </div>

                    <div className="order-summary__total">
                      <span>Total</span>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                  </div>
                </div>

                {status === "integration" && (
                  <div
                    className="reservation-form__notice"
                    role="status"
                  >
                    <strong>Online ordering coming soon. </strong>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {status === "error" && (
                  <div
                    className="reservation-form__error"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="order-form__actions">
                  <button
                    type="button"
                    className="button button--light"
                    onClick={() => setStep("details")}
                    disabled={status === "submitting"}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>

                  <button
                    type="submit"
                    className="button button--dark"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Processing..." : "Place order"}
                    {status !== "submitting" && (
                      <ArrowRight size={16} />
                    )}
                  </button>
                </div>

                <p className="reservation-form__note">
                  {form.fulfillment === "delivery"
                    ? "Your order will be confirmed via the phone number or email address provided."
                    : "We'll contact you via the phone number or email address provided to confirm your pickup."}
                </p>
              </form>
            )}

            <div className="order-modal__footer">
              <Clock3 size={15} />
              <span>
                Orders are prepared fresh and subject to availability.
              </span>
            </div>
          </>
        )}

        {addMoreOpen && status !== "success" && (
          <>
            <button
              type="button"
              className="order-add-more__backdrop"
              aria-label="Close menu"
              onClick={() => setAddMoreOpen(false)}
            />

            <aside className="order-add-more__drawer" aria-label="Add more items">
              <div className="order-add-more__header">
                <div>
                  <p className="eyebrow">Add to your order</p>
                  <h3>More from the menu</h3>
                </div>

                <button
                  type="button"
                  className="order-add-more__close"
                  onClick={() => setAddMoreOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="order-add-more__list">
                {allMenuItems.map((item) => {
                  const isAdded = addedItemNames.has(item.name);

                  return (
                    <div
                      className={`order-add-more__item${
                        isAdded ? " is-added" : ""
                      }`}
                      key={item.name}
                    >
                      <div className="order-add-more__image">
                        <img src={item.image} alt="" />
                      </div>

                      <div className="order-add-more__copy">
                        <span>{item.category}</span>
                        <strong>{item.name}</strong>
                        <small>{item.price}</small>
                      </div>

                      <button
                        type="button"
                        className="order-add-more__button"
                        onClick={() => handleAddItem(item)}
                        aria-label={
                          isAdded
                            ? `${item.name} added. Add another`
                            : `Add ${item.name}`
                        }
                      >
                        {isAdded ? <Check size={15} /> : <Plus size={15} />}
                        <span>{isAdded ? "Added" : "Add"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
