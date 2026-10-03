import { FormEvent, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Users,
  X,
} from "lucide-react";

type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
};

type ReservationForm = {
  date: string;
  time: string;
  guests: string;
  name: string;
  phone: string;
  email: string;
  requests: string;
};

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "integration";

const initialForm: ReservationForm = {
  date: "",
  time: "",
  guests: "2",
  name: "",
  phone: "",
  email: "",
  requests: "",
};

const integrationMessage =
  "This is a website template. Reservations will be available once the live website is connected to the restaurant's booking system.";

export default function ReservationModal({
  open,
  onClose,
}: ReservationModalProps) {
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("modal-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (
    field: keyof ReservationForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    setStatus("submitting");
    setErrorMessage("");
  
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      // The API route does not exist yet.
      // This is expected for the portfolio template.
      if (response.status === 404 || response.status === 405) {
        setStatus("integration");
        setErrorMessage(
          "You're currently viewing a website template. Reservations will be available once the live website is connected to the restaurant's booking system."
        );
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
          setErrorMessage(
            "This reservation form is ready for backend integration. Once connected to the restaurant's reservation system, your request will be processed and confirmed via the contact details provided."
          );
          return;
        }
      }
  
      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.message ||
            data.error ||
            "Something went wrong. Please try again."
        );
        return;
      }
  
      setStatus("success");
    } catch {
      // Network failure / backend unavailable
      setStatus("integration");
      setErrorMessage(
        "This reservation form is ready for backend integration. Once connected to the restaurant's reservation system, your request will be processed and confirmed via the contact details provided."
      );
    }
  };

  const handleClose = () => {
    if (status === "submitting") return;

    setForm(initialForm);
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      className="reservation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="reservation-modal__panel">
        <button
          type="button"
          className="reservation-modal__close"
          onClick={handleClose}
          aria-label="Close reservation form"
          disabled={status === "submitting"}
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="reservation-success">
            <div className="reservation-success__icon">
              <Check size={25} />
            </div>

            <p className="eyebrow">Reservation received</p>

            <h2>
              Your table is
              <em> requested.</em>
            </h2>

            <p>
              Thank you, {form.name}. We've received your reservation
              request for {form.guests}{" "}
              {Number(form.guests) === 1 ? "guest" : "guests"} on{" "}
              {form.date} at {form.time}.
            </p>

            <p>
              We'll contact you at {form.phone} or {form.email} to
              confirm your table.
            </p>

            <button
              type="button"
              className="button button--primary"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="reservation-modal__header">
              <p className="eyebrow">Reservations</p>

              <h2 id="reservation-modal-title">
                Make a moment
                <em> of it.</em>
              </h2>

              <p>
                Fill up the form and leave the rest to us.
              </p>
            </div>

            <form
              className="reservation-form"
              onSubmit={handleSubmit}
            >
              <div className="reservation-form__grid">
                <label>
                  <span>Date</span>

                  <div className="reservation-input">
                    <CalendarDays size={16} />

                    <input
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(event) =>
                        updateField("date", event.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label>
                  <span>Preferred time</span>

                  <div className="reservation-input">
                    <Clock3 size={16} />

                    <input
                      type="time"
                      value={form.time}
                      onChange={(event) =>
                        updateField("time", event.target.value)
                      }
                      required
                    />
                  </div>
                </label>
              </div>

              <label>
                <span>Number of guests</span>

                <div className="reservation-input">
                  <Users size={16} />

                  <select
                    value={form.guests}
                    onChange={(event) =>
                      updateField("guests", event.target.value)
                    }
                    required
                  >
                    {Array.from({ length: 12 }, (_, index) => {
                      const value = String(index + 1);

                      return (
                        <option key={value} value={value}>
                          {value}{" "}
                          {index === 0 ? "guest" : "guests"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </label>

              <div className="reservation-form__grid">
                <label>
                  <span>Your name</span>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span>Phone number</span>

                  <div className="reservation-input">
                    <Phone size={16} />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="+254 700 000 000"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </label>
              </div>

              <label>
                <span>Email address</span>

                <div className="reservation-input">
                  <Mail size={16} />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label>
                <span>
                  Special requests <small>(optional)</small>
                </span>

                <textarea
                  value={form.requests}
                  onChange={(event) =>
                    updateField("requests", event.target.value)
                  }
                  placeholder="Birthday, anniversary, dietary requirements..."
                  rows={3}
                />
              </label>

              {status === "integration" && (
                <div
                  className="reservation-form__notice"
                  role="status"
                >
                  <strong>Reservation system coming soon. </strong>

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

              <button
                type="submit"
                className="button button--primary reservation-form__submit"
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Checking availability..."
                  : "Request a table"}
              </button>

              <p className="reservation-form__note">
                Your reservation will be confirmed via the email
                address or phone number provided.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}