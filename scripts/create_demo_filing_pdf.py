from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


output = Path(__file__).resolve().parents[1] / "public" / "demo" / "demo-interim-relief-application.pdf"
output.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CaseTitle", parent=styles["Heading1"], fontName="Times-Bold", fontSize=15, leading=19, alignment=1, spaceAfter=13))
styles.add(ParagraphStyle(name="Court", parent=styles["Normal"], fontName="Times-Bold", fontSize=11, leading=14, alignment=1, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyCase", parent=styles["BodyText"], fontName="Times-Roman", fontSize=10.5, leading=15, spaceAfter=10))
styles.add(ParagraphStyle(name="Section", parent=styles["Heading2"], fontName="Times-Bold", fontSize=11, leading=14, spaceBefore=8, spaceAfter=6))
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=23 * mm, leftMargin=23 * mm, topMargin=21 * mm, bottomMargin=21 * mm, title="Synthetic interim relief application")
story = [
    Paragraph("SYNTHETIC DEMONSTRATION DOCUMENT", styles["Court"]),
    Paragraph("IN THE DISTRICT &amp; SESSIONS COURT, DARJEELING", styles["Court"]),
    Spacer(1, 5),
    Paragraph("Rahul Sharma (synthetic) v. State of West Bengal (synthetic)", styles["CaseTitle"]),
    Paragraph("NYA-WB-DEMO-04821", styles["Court"]),
    Paragraph("APPLICATION FOR INTERIM RELIEF", styles["CaseTitle"]),
    Paragraph("This fictional filing is provided only for the Nyaya prototype. It is not an official court document, has no legal effect, and contains no personal or government-sourced information.", styles["BodyCase"]),
    Paragraph("Jurisdiction", styles["Section"]),
    Paragraph("The petitioner submits this synthetic application within the prototype record for a matter presented before the fictional demonstration court named above.", styles["BodyCase"]),
    Paragraph("Relief / Prayer", styles["Section"]),
    Paragraph("The petitioner respectfully requests interim relief for the limited purpose of demonstrating a document-intake workflow. No legal merits are asserted or evaluated.", styles["BodyCase"]),
    Paragraph("Verification", styles["Section"]),
    Paragraph("I, Rahul Sharma (synthetic), verify that this demonstration text is created only for a hackathon prototype and is not a factual filing.", styles["BodyCase"]),
    Paragraph("Affidavit and annexures", styles["Section"]),
    Paragraph("A synthetic affidavit reference is included. Annexure A and Annexure C are referenced for review. Annexure B is intentionally not listed, so the prototype can demonstrate a non-legal intake warning.", styles["BodyCase"]),
    Paragraph("Filed by: A. Sen (synthetic), petitioner advocate reference", styles["BodyCase"]),
    Paragraph("Note: a court-fee statement is intentionally not included. This is a structural demonstration flag only, not a statement about legal validity.", styles["BodyCase"]),
]
doc.build(story)
print(output)
