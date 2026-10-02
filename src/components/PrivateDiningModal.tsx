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

type PrivateDiningModalProps = {
  open: boolean;
  onClose: () => void;
};

type PrivateDiningForm = {
  eventType: string;
  date: string;
  time: string;
  guests: string;
  name: string;
  phone: string;
  email: string;
  requests: string;
};

const initialForm: PrivateDiningForm = {
  eventType: "",
  date: "",
  time: "",
  guests: "10",
  name: "",
  phone: "",
  email: "",
  requests: "",
};

export default function PrivateDiningModal({
  open,
  onClose,
}: PrivateDiningModalProps) {
  const [form, setForm] =
    useState<PrivateDiningForm>(initialForm);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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
    field: keyof PrivateDiningForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/private-dining", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "We couldn't send your private dining enquiry."
        );
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
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
      aria-labelledby="private-dining-modal-title"
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
          aria-label="Close private dining enquiry"
          disabled={status === "submitting"}
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="reservation-success">
            <div className="reservation-success__icon">
              <Check size={25} />
            </div>

            <p className="eyebrow">Enquiry received</p>

            <h2>
              Let's plan something
              <em> beautiful.</em>
            </h2>

            <p>
              Thank you, {form.name}. We've received your private
              dining enquiry for {form.guests} guests.
            </p>

            <p>
              We'll contact you via {form.email} or {form.phone} to
              discuss availability and the details of your event.
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
              <p className="eyebrow">Private Dining</p>

              <h2 id="private-dining-modal-title">
                Gather
                <em> beautifully.</em>
              </h2>

              <p>
                Tell us about your occasion and we will create an experience around it.
              </p>
            </div>

            <form
              className="reservation-form"
              onSubmit={handleSubmit}
            >
              <label>
                <span>Event type</span>

                <select
                  value={form.eventType}
                  onChange={(event) =>
                    updateField("eventType", event.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select an occasion
                  </option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Corporate event">
                    Corporate event
                  </option>
                  <option value="Family celebration">
                    Family celebration
                  </option>
                  <option value="Wedding event">
                    Wedding event
                  </option>
                  <option value="Private dinner">
                    Private dinner
                  </option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <div className="reservation-form__grid">
                <label>
                  <span>Preferred date</span>

                  <div className="reservation-input">
                    <CalendarDays size={16} />

                    <input
                      type="date"
                      value={form.date}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
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

                  <input
                    type="number"
                    min="2"
                    max="200"
                    value={form.guests}
                    onChange={(event) =>
                      updateField("guests", event.target.value)
                    }
                    required
                  />
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
                  Tell us more <small>(optional)</small>
                </span>

                <textarea
                  value={form.requests}
                  onChange={(event) =>
                    updateField("requests", event.target.value)
                  }
                  placeholder="Dietary requirements, preferred setup, entertainment, special arrangements..."
                  rows={4}
                />
              </label>

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
                  ? "Sending enquiry..."
                  : "Book a private table"}
              </button>

              <p className="reservation-form__note">
                We will contact you via the email address or
                phone number provided to make arrangements.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}