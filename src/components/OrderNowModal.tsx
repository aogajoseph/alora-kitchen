import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

type OrderItem = {
  category: string;
  name: string;
  price: string;
  priceValue: number;
  tag: string;
  image: string;
};

type OrderNowModalProps = {
  item: OrderItem | null;
  open: boolean;
  onClose: () => void;
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
  item,
  open,
  onClose,
}: OrderNowModalProps) {
  const [step, setStep] = useState<Step>("order");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    setStep("order");
    setQuantity(1);
    setForm(initialForm);
    setStatus("idle");
    setErrorMessage("");
  }, [open, item]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose]);

  const subtotal = useMemo(() => {
    if (!item) return 0;
    return item.priceValue * quantity;
  }, [item, quantity]);

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
    setStep("details");
  };

  const handleContinueToReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("review");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!item) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: {
            category: item.category,
            name: item.name,
            price: item.priceValue,
            quantity,
          },
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

  if (!open || !item) return null;

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
              We've received your order for {quantity}{" "}
              {quantity === 1 ? "plate" : "plates"} of {item.name}.
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
                <div className="order-item">
                  <div className="order-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="order-item__copy">
                    <span>{item.category}</span>

                    <h3>{item.name}</h3>

                    <strong>{item.price}</strong>

                    <div className="order-quantity">
                      <span>Number of plates</span>

                      <div className="order-quantity__controls">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQuantity((current) =>
                              Math.max(1, current - 1)
                            )
                          }
                          disabled={quantity === 1}
                        >
                          <Minus size={15} />
                        </button>

                        <strong>{quantity}</strong>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            setQuantity((current) => current + 1)
                          }
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

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
                      onClick={() =>
                        updateForm("fulfillment", "pickup")
                      }
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
                    <span>Delivery location</span>

                    <div className="reservation-form__input-wrap">
                      <MapPin size={17} />

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
                  <span>Your name</span>

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
                  <span>Phone number</span>

                  <div className="reservation-form__input-wrap">
                    <Phone size={17} />

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
                  <span>Email address</span>

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
                  <div className="order-review__item">
                    <img src={item.image} alt={item.name} />

                    <div>
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <p>
                        {quantity}{" "}
                        {quantity === 1 ? "plate" : "plates"}
                      </p>
                    </div>

                    <strong>{formatPrice(subtotal)}</strong>
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
                    {status === "submitting"
                      ? "Processing..."
                      : "Place order"}
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
      </div>
    </div>
  );
}