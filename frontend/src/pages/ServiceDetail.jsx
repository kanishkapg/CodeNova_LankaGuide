import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../utils/appContext";
import { createAppointment } from "../utils/api";
import { classNames, useLocalStore } from "../utils/helpers";
import { Upload } from "lucide-react";

const Stepper = ({ steps, active, onStep, allowedUpTo }) => (
  <div className="my-4">
    <div className="flex items-center justify-between text-sm">
      {steps.map((s, i) => (
        <button
          key={s}
          onClick={() => i <= allowedUpTo && onStep(i)}
          disabled={i > allowedUpTo}
          className="flex-1"
        >
          <div
            className={classNames(
              "flex items-center gap-2 p-2 rounded-2xl",
              i === active
                ? "bg-green-50 text-green-800 border border-green-200"
                : "text-gray-600 hover:bg-gray-50 border"
            )}
          >
            <div
              className={classNames(
                "w-6 h-6 grid place-items-center rounded-full text-white text-xs",
                i <= active ? "bg-green-600" : "bg-gray-300",
                i > allowedUpTo && "opacity-50"
              )}
            >
              {i + 1}
            </div>
            <div className="text-left">{s}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <label className="block text-sm">
    <div className="mb-1 text-gray-600">{label}</div>
    <input
      {...props}
      className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-200"
    />
  </label>
);

const FileDrop = ({ label, onFile }) => {
  const ref = useRef();
  const pick = () => ref.current?.click();
  const handle = (f) => {
    if (f && f[0]) {
      const file = f[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        onFile({ name: file.name, size: file.size, dataUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      className="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer hover:bg-gray-50"
      onClick={pick}
    >
      <Upload className="w-5 h-5 mx-auto" />
      <div className="text-sm mt-1">{label}</div>
      <input
        type="file"
        ref={ref}
        onChange={(e) => handle(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    // request both emoji 'flag' and image urls in 'flags'
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,flag")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const sorted = data
          .map((c) => ({
            code: c.cca2,
            name: c.name.common,
            flagEmoji: c.flag || null,
            flagUrl: (c.flags && (c.flags.svg || c.flags.png)) || null,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const filtered = q
    ? countries.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    : countries;

  const selected = countries.find((c) => c.code === value);

  const renderFlag = (c) => {
    if (!c) return "🌐";
    if (c.flagUrl)
      return (
        <img src={c.flagUrl} alt={c.name} className="w-6 h-4 object-contain" />
      );
    if (c.flagEmoji) return <span className="text-sm">{c.flagEmoji}</span>;
    return "🌐";
  };

  return (
    <div className="relative">
      <div className="mb-1 text-gray-600 text-sm">Nationality</div>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="w-full p-2 border rounded-xl text-left flex items-center gap-2"
      >
        <span className="w-6 h-4 flex items-center justify-center text-sm">
          {renderFlag(selected)}
        </span>
        <span className="flex-1">
          {selected ? selected.name : "Select a country..."}
        </span>
        <span className="text-xs text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow max-h-60 overflow-auto p-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search country..."
            className="w-full p-2 border rounded mb-2"
          />
          <div className="space-y-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQ("");
                }}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="w-6 h-4 flex items-center justify-center text-sm">
                  {c.flagUrl ? (
                    <img
                      src={c.flagUrl}
                      alt={c.name}
                      className="w-6 h-4 object-contain"
                    />
                  ) : (
                    c.flagEmoji || "🌐"
                  )}
                </span>
                <span className="flex-1">{c.name}</span>
                <span className="text-xs text-gray-400">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function WorkingVisaExtension() {
  const steps = [
    "Your Details",
    "Documents",
    "Appointment",
    "Payment",
    "Review & Submit",
  ];
  const [step, setStep] = useState(0);
  const [form, setForm] = useLocalStore("lg_wve_form", {
    fullName: "",
    passportNo: "",
    nationality: "",
    email: "",
    phone: "",
    paymentMethod: "",
    photo: null,
    employerLetter: null,
    date: null,
    time: null,
    period: "3 months",
    agree: false,
  });
  const { addAppointment, user } = useApp();
  const nav = useNavigate();

  const fee = useMemo(() => {
    // determine base fee by country code: Sri Lanka (LK) = 0, SAARC = 2000, Other = 5000
    const mult =
      form.period === "3 months" ? 1 : form.period === "6 months" ? 1.8 : 3.2;
    const saarcCodes = ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"];
    const code = (form.nationality || "").toUpperCase();
    let base = 5000;
    if (code === "LK") base = 0;
    else if (saarcCodes.includes(code)) base = 2000;
    return Math.round(base * mult);
  }, [form.nationality, form.period]);

  const isStepComplete = (i) => {
    if (i === 0)
      return !!(form.fullName && form.passportNo && form.nationality);
    if (i === 1) return !!(form.photo && form.employerLetter);
    if (i === 2) return !!(form.date && form.time);
    if (i === 3) return true; // payment step (demo)
    if (i === 4) return !!form.agree;
    return false;
  };

  const firstIncomplete = steps.findIndex((_, i) => !isStepComplete(i));
  const allowedUpTo =
    firstIncomplete === -1 ? steps.length - 1 : firstIncomplete;

  // if user somehow is on a step that's now beyond the allowed step, clamp it
  useEffect(() => {
    if (step > allowedUpTo) setStep(allowedUpTo);
  }, [allowedUpTo, step]);

  const submit = async () => {
    const dt = new Date(`${form.date}T${form.time}:00`);
    const base = {
      title: "Working Visa Extension",
      datetime: dt.toISOString(),
      location: "Immigration & Emigration HQ, Battaramulla",
      status: "Submitted",
      meta: { ...form },
      departmentId: "immigration",
      serviceId: "working-visa-extension",
    };

    try {
      // attempt to persist to server for both authenticated and anonymous users
      const serverBody = {
        userId: user && (user._id || user.id) ? user._id || user.id : undefined,
        departmentId: base.departmentId,
        serviceId: base.serviceId,
        datetime: base.datetime,
        meta: base.meta,
      };

      const created = await createAppointment(serverBody);
      // normalize server response to frontend shape
      const normalized = {
        id: created._id || created.id || created._id,
        ...created,
      };
      addAppointment(normalized);
    } catch (err) {
      console.warn(
        "Failed to create appointment on server, saving locally:",
        err.message
      );
      // fallback: keep local-only appointment so user still sees it
      addAppointment({ id: crypto.randomUUID(), ...base });
    } finally {
      // clear persisted form and navigate regardless of server success
      localStorage.removeItem("lg_wve_form");
      nav("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-1 text-sm text-gray-500">
        Department of Immigration & Emigration
      </div>
      <h2 className="text-2xl font-bold">Working Visa Extension</h2>
      <p className="text-gray-600">
        Complete the steps below to submit documents, select an appointment
        time, and pay online.
      </p>
      <Stepper
        steps={steps}
        active={step}
        onStep={setStep}
        allowedUpTo={allowedUpTo}
      />

      <div className="bg-white border rounded-3xl p-4 shadow-sm">
        {step === 0 && <DetailsStep form={form} setForm={setForm} />}
        {step === 1 && <DocumentsStep form={form} setForm={setForm} />}
        {step === 2 && <AppointmentStep form={form} setForm={setForm} />}
        {step === 3 && <PaymentStep form={form} setForm={setForm} fee={fee} />}
        {step === 4 && <ReviewStep form={form} fee={fee} setForm={setForm} />}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!isStepComplete(step)}
              className="px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!isStepComplete(steps.length - 1)}
              className="px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-50"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ...removed CountryPhoneInput (reverted to original phone input)

const DetailsStep = ({ form, setForm }) => (
  <div className="grid md:grid-cols-2 gap-3">
    <Input
      label="Full Name"
      value={form.fullName}
      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
    />
    <Input
      label="Passport Number"
      value={form.passportNo}
      onChange={(e) => setForm({ ...form, passportNo: e.target.value })}
    />
    <CountrySelect
      value={form.nationality}
      onChange={(v) => setForm({ ...form, nationality: v })}
    />
    <Input
      label="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />
    <Input
      label="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
    />
  </div>
);

const DocumentsStep = ({ form, setForm }) => (
  <div className="grid md:grid-cols-2 gap-3">
    <FileDrop
      label={
        form.photo
          ? `Uploaded: ${form.photo.name}`
          : "Upload passport size photo"
      }
      onFile={(f) => setForm({ ...form, photo: f })}
    />
    <FileDrop
      label={
        form.employerLetter
          ? `Uploaded: ${form.employerLetter.name}`
          : "Upload employer letter"
      }
      onFile={(f) => setForm({ ...form, employerLetter: f })}
    />
    <div className="md:col-span-2 text-sm text-gray-500">
      Accepted formats: JPG/PNG/PDF. Max 5MB each. (Demo only)
    </div>
  </div>
);

const AppointmentStep = ({ form, setForm }) => {
  const [month, setMonth] = useState(new Date());
  const slotsPerDay = ["09:00", "10:00", "11:00", "14:00", "15:00"];
  const year = month.getFullYear(),
    m = month.getMonth();
  const start = new Date(year, m, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const days = Array.from({ length: startDay })
    .map(() => "")
    .concat(Array.from({ length: daysInMonth }).map((_, i) => i + 1));

  // compute today's date (midnight) for comparisons
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const selectDate = (d) => {
    if (!d) return;
    const picked = new Date(year, m, d);
    // prevent selecting past dates
    if (picked < todayDate) return;
    const date = picked.toISOString().slice(0, 10);
    setForm({ ...form, date, time: null });
  };
  const prev = () => setMonth(new Date(year, m - 1, 1));
  const next = () => setMonth(new Date(year, m + 1, 1));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={prev}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ‹
          </button>
          <div className="font-medium">
            {month.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            onClick={next}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 text-xs text-center text-gray-500">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} className="aspect-square" />;
            const dayDate = new Date(year, m, d);
            const isPast = dayDate < todayDate;
            const iso = dayDate.toISOString().slice(0, 10);
            const isSelected = form.date === iso;
            const isToday = dayDate.getTime() === todayDate.getTime();
            const baseClass = "aspect-square rounded-xl text-sm";
            const stateClass = isPast
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isSelected
              ? "ring-2 ring-green-400 bg-green-600 text-white"
              : isToday
              ? "bg-green-50 text-green-800"
              : "bg-gray-50 hover:bg-gray-100";
            return (
              <button
                key={i}
                disabled={isPast}
                onClick={() => selectDate(d)}
                className={classNames(baseClass, stateClass)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className="font-medium">Available time slots</div>
        {!form.date ? (
          <div className="text-sm text-gray-500 mt-2">
            Select a date to view slots.
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["09:00", "10:00", "11:00", "14:00", "15:00"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, time: t })}
                className={classNames(
                  "px-3 py-2 rounded-xl border",
                  form.time === t
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentStep = ({ form, setForm, fee }) => (
  <div className="grid md:grid-cols-2 gap-4">
    <label className="block text-sm">
      <div className="mb-1 text-gray-600">Extension Period</div>
      <select
        value={form.period}
        onChange={(e) => setForm({ ...form, period: e.target.value })}
        className="w-full p-2 border rounded-xl"
      >
        <option>3 months</option>
        <option>6 months</option>
        <option>12 months</option>
      </select>
    </label>

    <div className="bg-gray-50 rounded-2xl p-3">
      <div className="font-medium">Fee summary</div>
      <div className="text-sm text-gray-600">
        Based on nationality and period.
      </div>
      <div className="mt-2 text-2xl font-bold">LKR {fee.toLocaleString()}</div>
      <div className="text-xs text-gray-500">
        (Demo only — no real payments processed)
      </div>
    </div>

    <div className="md:col-span-2">
      <div className="font-medium mb-2">Payment Method</div>
      <div className="grid grid-cols-3 gap-2">
        {["Visa", "MasterCard", "Amex"].map((p) => {
          const selected = form.paymentMethod === p;
          return (
            <button
              key={p}
              onClick={() => setForm({ ...form, paymentMethod: p })}
              aria-pressed={selected}
              className={classNames(
                "px-3 py-2 rounded-xl border inline-flex items-center gap-2",
                selected
                  ? "ring-2 ring-green-400 bg-green-50"
                  : "hover:bg-gray-50"
              )}
            >
              {p === "Visa" && (
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect width="36" height="20" fill="#1A1F71" rx="2" />
                  <text
                    x="18"
                    y="14"
                    fontFamily="Arial,Helvetica,sans-serif"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    VISA
                  </text>
                </svg>
              )}
              {p === "MasterCard" && (
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect width="36" height="20" fill="#fff" rx="2" />
                  <g transform="translate(6,2)">
                    <circle cx="8" cy="8" r="6" fill="#EB001B" />
                    <circle cx="16" cy="8" r="6" fill="#F79E1B" />
                  </g>
                </svg>
              )}
              {p === "Amex" && (
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect width="36" height="20" fill="#2E77BB" rx="2" />
                  <text
                    x="18"
                    y="14"
                    fontFamily="Arial,Helvetica,sans-serif"
                    fontSize="8"
                    fill="#fff"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    AMEX
                  </text>
                </svg>
              )}
              <span className="ml-2">{p}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const ReviewStep = ({ form, fee, setForm }) => (
  <div className="space-y-3">
    <div className="grid md:grid-cols-2 gap-3">
      <Info label="Full Name" value={form.fullName} />
      <Info label="Passport No" value={form.passportNo} />
      <Info label="Nationality" value={form.nationality} />
      <Info label="Email" value={form.email} />
      <Info label="Phone" value={form.phone} />
      <Info label="Period" value={form.period} />
      <Info
        label="Appointment"
        value={`${form.date || "-"} ${form.time || ""}`}
      />
      <Info label="Fee" value={`LKR ${fee.toLocaleString()}`} />
    </div>
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        onChange={(e) => setForm({ ...form, agree: e.target.checked })}
        checked={!!form.agree}
        className="mt-[3px]"
      />
      <span>
        I hereby declare that the information provided is true and accurate, and
        I agree to the rules & conditions of the Department of Immigration &
        Emigration.
      </span>
    </label>
  </div>
);

const Info = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-2xl text-sm">
    <span className="text-gray-500">{label}: </span>
    <span className="font-medium">{value}</span>
  </div>
);
