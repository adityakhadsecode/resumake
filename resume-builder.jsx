import { useState } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const initialData = {
  name: "Jordan Alvarez",
  title: "Product Designer",
  email: "jordan.alvarez@email.com",
  phone: "(555) 012-3344",
  location: "Austin, TX",
  links: "linkedin.com/in/jordanalvarez",
  summary:
    "Product designer with 5 years shipping consumer web and mobile products end to end, from research through high-fidelity UI. Comfortable owning a problem space and partnering closely with engineering.",
  experience: [
    {
      id: uid(),
      role: "Senior Product Designer",
      company: "Lumen Health",
      location: "Remote",
      start: "2022",
      end: "Present",
      bullets:
        "Led redesign of the patient intake flow, cutting drop-off by 24%\nBuilt and maintained the company's first shared design system in Figma\nRan weekly usability sessions and translated findings into shipped changes",
    },
    {
      id: uid(),
      role: "Product Designer",
      company: "Northwind Software",
      location: "Austin, TX",
      start: "2019",
      end: "2022",
      bullets:
        "Owned onboarding and billing flows for a B2B SaaS product\nPartnered with PM and eng to ship a self-serve upgrade flow, +18% conversion",
    },
  ],
  education: [
    {
      id: uid(),
      school: "University of Texas at Austin",
      degree: "B.F.A. in Design",
      start: "2015",
      end: "2019",
      detail: "",
    },
  ],
  skills: "Figma, User Research, Design Systems, Prototyping, HTML/CSS, Usability Testing",
  projects: [],
};

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={styles.fieldLabel}>{label}</span>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={styles.textarea}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </label>
  );
}

function SectionHeader({ children }) {
  return <div style={styles.sectionHeader}>{children}</div>;
}

export default function ResumeBuilder() {
  const [data, setData] = useState(initialData);

  const set = (key) => (val) => setData((d) => ({ ...d, [key]: val }));

  const updateItem = (listKey, id, field, value) => {
    setData((d) => ({
      ...d,
      [listKey]: d[listKey].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = (listKey, blank) => {
    setData((d) => ({ ...d, [listKey]: [...d[listKey], { id: uid(), ...blank }] }));
  };

  const removeItem = (listKey, id) => {
    setData((d) => ({ ...d, [listKey]: d[listKey].filter((i) => i.id !== id) }));
  };

  const handlePrint = () => {
    window.print();
  };

  const skillList = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div style={styles.app}>
      <style>{printCss}</style>

      <div style={styles.topbar} className="no-print">
        <div>
          <div style={styles.topbarTitle}>Resume Builder</div>
          <div style={styles.topbarSub}>Free. No account, no watermark.</div>
        </div>
        <button style={styles.printBtn} onClick={handlePrint}>
          Download PDF
        </button>
      </div>

      <div style={styles.body}>
        {/* LEFT: FORM */}
        <div style={styles.formPane} className="no-print">
          <SectionHeader>Contact</SectionHeader>
          <div style={styles.row2}>
            <Field label="Full name" value={data.name} onChange={set("name")} />
            <Field label="Title" value={data.title} onChange={set("title")} />
          </div>
          <div style={styles.row2}>
            <Field label="Email" value={data.email} onChange={set("email")} />
            <Field label="Phone" value={data.phone} onChange={set("phone")} />
          </div>
          <div style={styles.row2}>
            <Field label="Location" value={data.location} onChange={set("location")} />
            <Field label="Links" value={data.links} onChange={set("links")} placeholder="linkedin.com/in/you" />
          </div>

          <SectionHeader>Summary</SectionHeader>
          <Field
            label="A few sentences on who you are"
            value={data.summary}
            onChange={set("summary")}
            type="textarea"
          />

          <SectionHeader>
            Experience
            <button
              style={styles.addBtn}
              onClick={() =>
                addItem("experience", {
                  role: "",
                  company: "",
                  location: "",
                  start: "",
                  end: "",
                  bullets: "",
                })
              }
            >
              + Add role
            </button>
          </SectionHeader>
          {data.experience.map((exp) => (
            <div key={exp.id} style={styles.card}>
              <div style={styles.cardTopRow}>
                <div style={styles.row2} className="grow">
                  <Field
                    label="Role"
                    value={exp.role}
                    onChange={(v) => updateItem("experience", exp.id, "role", v)}
                  />
                  <Field
                    label="Company"
                    value={exp.company}
                    onChange={(v) => updateItem("experience", exp.id, "company", v)}
                  />
                </div>
                <button style={styles.removeBtn} onClick={() => removeItem("experience", exp.id)}>
                  Remove
                </button>
              </div>
              <div style={styles.row3}>
                <Field
                  label="Location"
                  value={exp.location}
                  onChange={(v) => updateItem("experience", exp.id, "location", v)}
                />
                <Field
                  label="Start"
                  value={exp.start}
                  onChange={(v) => updateItem("experience", exp.id, "start", v)}
                />
                <Field
                  label="End"
                  value={exp.end}
                  onChange={(v) => updateItem("experience", exp.id, "end", v)}
                />
              </div>
              <Field
                label="Highlights (one per line)"
                value={exp.bullets}
                onChange={(v) => updateItem("experience", exp.id, "bullets", v)}
                type="textarea"
              />
            </div>
          ))}

          <SectionHeader>
            Education
            <button
              style={styles.addBtn}
              onClick={() =>
                addItem("education", { school: "", degree: "", start: "", end: "", detail: "" })
              }
            >
              + Add school
            </button>
          </SectionHeader>
          {data.education.map((ed) => (
            <div key={ed.id} style={styles.card}>
              <div style={styles.cardTopRow}>
                <div style={styles.row2} className="grow">
                  <Field
                    label="School"
                    value={ed.school}
                    onChange={(v) => updateItem("education", ed.id, "school", v)}
                  />
                  <Field
                    label="Degree"
                    value={ed.degree}
                    onChange={(v) => updateItem("education", ed.id, "degree", v)}
                  />
                </div>
                <button style={styles.removeBtn} onClick={() => removeItem("education", ed.id)}>
                  Remove
                </button>
              </div>
              <div style={styles.row2}>
                <Field
                  label="Start"
                  value={ed.start}
                  onChange={(v) => updateItem("education", ed.id, "start", v)}
                />
                <Field
                  label="End"
                  value={ed.end}
                  onChange={(v) => updateItem("education", ed.id, "end", v)}
                />
              </div>
              <Field
                label="Detail (optional)"
                value={ed.detail}
                onChange={(v) => updateItem("education", ed.id, "detail", v)}
                placeholder="Honors, GPA, relevant coursework"
              />
            </div>
          ))}

          <SectionHeader>Skills</SectionHeader>
          <Field
            label="Comma-separated"
            value={data.skills}
            onChange={set("skills")}
            type="textarea"
          />
        </div>

        {/* RIGHT: PREVIEW */}
        <div style={styles.previewPane} className="no-print">
          <div style={styles.sheet} className="resume-sheet">
            <ResumeContent data={data} skillList={skillList} />
          </div>
        </div>
      </div>

      {/* Print-only clone, so print CSS has one clean target */}
      <div className="print-only">
        <div style={styles.sheet} className="resume-sheet">
          <ResumeContent data={data} skillList={skillList} />
        </div>
      </div>
    </div>
  );
}

function ResumeContent({ data, skillList }) {
  return (
    <>
      <div style={styles.rName}>{data.name || "Your Name"}</div>
      <div style={styles.rTitle}>{data.title}</div>
      <div style={styles.rContact}>
        {[data.location, data.phone, data.email, data.links].filter(Boolean).join("   ·   ")}
      </div>

      {data.summary && (
        <>
          <div style={styles.rDivider} />
          <p style={styles.rSummary}>{data.summary}</p>
        </>
      )}

      {data.experience.length > 0 && (
        <>
          <div style={styles.rDivider} />
          <div style={styles.rSectionTitle}>Experience</div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={styles.rItem}>
              <div style={styles.rItemTopRow}>
                <span style={styles.rItemTitle}>
                  {exp.role}
                  {exp.company ? `, ${exp.company}` : ""}
                </span>
                <span style={styles.rItemMeta}>
                  {[exp.start, exp.end].filter(Boolean).join(" – ")}
                </span>
              </div>
              {exp.location && <div style={styles.rItemSub}>{exp.location}</div>}
              <ul style={styles.rList}>
                {exp.bullets
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean)
                  .map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.education.length > 0 && (
        <>
          <div style={styles.rDivider} />
          <div style={styles.rSectionTitle}>Education</div>
          {data.education.map((ed) => (
            <div key={ed.id} style={styles.rItem}>
              <div style={styles.rItemTopRow}>
                <span style={styles.rItemTitle}>{ed.school}</span>
                <span style={styles.rItemMeta}>
                  {[ed.start, ed.end].filter(Boolean).join(" – ")}
                </span>
              </div>
              {ed.degree && <div style={styles.rItemSub}>{ed.degree}</div>}
              {ed.detail && <div style={styles.rItemSub}>{ed.detail}</div>}
            </div>
          ))}
        </>
      )}

      {skillList.length > 0 && (
        <>
          <div style={styles.rDivider} />
          <div style={styles.rSectionTitle}>Skills</div>
          <div style={styles.rSkills}>{skillList.join("   ·   ")}</div>
        </>
      )}
    </>
  );
}

const printCss = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { margin: 0; }
    .resume-sheet {
      box-shadow: none !important;
      width: 100% !important;
      min-height: 0 !important;
      padding: 0 !important;
    }
    @page { size: letter; margin: 0.6in; }
  }
  .print-only { display: none; }
`;

const serif = `Georgia, 'Times New Roman', Times, serif`;
const sans = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;

const styles = {
  app: {
    fontFamily: sans,
    background: "#F3F2EF",
    color: "#1C1D21",
    minHeight: "600px",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 28px",
    borderBottom: "1px solid #DAD5C9",
    background: "#FAFAF8",
  },
  topbarTitle: { fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" },
  topbarSub: { fontSize: 12.5, color: "#5B5F6B", marginTop: 2 },
  printBtn: {
    background: "#28344E",
    color: "#F3F2EF",
    border: "none",
    borderRadius: 3,
    padding: "9px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: sans,
  },
  body: {
    display: "flex",
    gap: 0,
  },
  formPane: {
    width: "46%",
    padding: "24px 28px 80px",
    boxSizing: "border-box",
    maxHeight: "calc(100vh - 70px)",
    overflowY: "auto",
  },
  previewPane: {
    width: "54%",
    background: "#E9E7E1",
    padding: "32px 24px",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  sheet: {
    background: "#FAFAF8",
    width: "100%",
    maxWidth: 620,
    minHeight: 800,
    padding: "48px 44px",
    boxShadow: "0 1px 3px rgba(28,29,33,0.15), 0 1px 12px rgba(28,29,33,0.08)",
    fontFamily: serif,
    boxSizing: "border-box",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: "#28344E",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: 26,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "1px solid #DAD5C9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    display: "block",
    fontSize: 11.5,
    color: "#5B5F6B",
    marginBottom: 4,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    border: "1px solid #DAD5C9",
    borderRadius: 3,
    fontSize: 13.5,
    fontFamily: sans,
    background: "#fff",
    color: "#1C1D21",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    border: "1px solid #DAD5C9",
    borderRadius: 3,
    fontSize: 13.5,
    fontFamily: sans,
    background: "#fff",
    color: "#1C1D21",
    resize: "vertical",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  row3: {
    display: "grid",
    gridTemplateColumns: "1fr 0.6fr 0.6fr",
    gap: 12,
  },
  card: {
    border: "1px solid #DAD5C9",
    borderRadius: 4,
    padding: 14,
    marginBottom: 14,
    background: "#FCFBF9",
  },
  cardTopRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  addBtn: {
    background: "none",
    border: "none",
    color: "#28344E",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "none",
    letterSpacing: 0,
    padding: 0,
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#9A5142",
    fontSize: 12,
    cursor: "pointer",
    marginTop: 20,
    whiteSpace: "nowrap",
  },
  rName: { fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", color: "#1C1D21" },
  rTitle: { fontSize: 14.5, color: "#28344E", marginTop: 2 },
  rContact: { fontSize: 11.5, color: "#5B5F6B", marginTop: 8 },
  rDivider: { borderTop: "1px solid #DAD5C9", margin: "16px 0" },
  rSummary: { fontSize: 13, lineHeight: 1.55, color: "#2B2C30", margin: 0 },
  rSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#28344E",
    marginBottom: 10,
  },
  rItem: { marginBottom: 14 },
  rItemTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  },
  rItemTitle: { fontSize: 13.5, fontWeight: 700, color: "#1C1D21" },
  rItemMeta: { fontSize: 11.5, color: "#5B5F6B", whiteSpace: "nowrap" },
  rItemSub: { fontSize: 12, color: "#5B5F6B", fontStyle: "italic", marginTop: 1 },
  rList: { margin: "6px 0 0", paddingLeft: 18, fontSize: 12.5, lineHeight: 1.55, color: "#2B2C30" },
  rSkills: { fontSize: 12.5, color: "#2B2C30", lineHeight: 1.6 },
};
