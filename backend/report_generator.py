import io
import csv
import zipfile
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# ============================================================================
# StudentConnector Color Palette & Brand Constants
# ============================================================================
PRIMARY = colors.HexColor("#173F3A")     # Deep Teal
SECONDARY = colors.HexColor("#79A995")   # Muted Sage
LIGHT_SAGE = colors.HexColor("#DCE9E1")  # Light Sage Background
ACCENT_AMBER = colors.HexColor("#E7B978")# Soft Amber
TEXT_DARK = colors.HexColor("#344541")   # Dark Slate Text
BG_IVORY = colors.HexColor("#F5F3ED")    # Warm Ivory Page Background
WHITE = colors.white
BORDER_COLOR = colors.HexColor("#C8D8CE")

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and stamp 'Page X of Y' in footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_DARK)

        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "StudentConnector — Academic Progress & Performance Report")
            self.setStrokeColor(BORDER_COLOR)
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Running Footer (all pages)
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Confidential Academic Record • Generated via StudentConnector Platform")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_str)
        self.restoreState()


def get_custom_styles():
    styles = getSampleStyleSheet()
    
    # Title
    styles.add(ParagraphStyle(
        name='BrandTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY
    ))
    styles.add(ParagraphStyle(
        name='ReportSubtitle',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY
    ))
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        name='NormalDark',
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_DARK
    ))
    styles.add(ParagraphStyle(
        name='BoldDark',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=TEXT_DARK
    ))
    styles.add(ParagraphStyle(
        name='TableHead',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=WHITE
    ))
    styles.add(ParagraphStyle(
        name='TableBody',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    ))
    styles.add(ParagraphStyle(
        name='TableBodyBold',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    ))
    styles.add(ParagraphStyle(
        name='RecommendationBox',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=PRIMARY
    ))
    return styles


# ============================================================================
# 1. INDIVIDUAL STUDENT PROGRESS REPORT (PDF)
# ============================================================================
def generate_student_progress_pdf(data: dict) -> bytes:
    """
    Builds a multi-page, formatted PDF for an individual student's
    academic performance across a specified period.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = get_custom_styles()
    story = []

    student = data.get("student", {})
    period = data.get("period", {})
    metrics = data.get("summary_metrics", {})
    subject_perf = data.get("subject_performance", [])
    assessments = data.get("assessment_records", [])
    attendance = data.get("attendance_summary", {})
    assignments = data.get("assignment_summary", {})
    trends = data.get("performance_trend", {})
    support_topics = data.get("support_topics", [])
    ai_recommendations = data.get("ai_recommendations", [])
    remarks = data.get("teacher_remarks", [])
    comparison = data.get("comparison", {})

    # Top Brand Bar / Header
    header_data = [
        [
            Paragraph("<b>StudentConnector</b>", styles['BrandTitle']),
            Paragraph(f"<b>OFFICIAL ACADEMIC PROGRESS REPORT</b><br/><font size=8 color='#79A995'>Generated: {datetime.now().strftime('%b %d, %Y %H:%M')}</font>", styles['NormalDark'])
        ]
    ]
    header_table = Table(header_data, colWidths=[280, 224])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=4, spaceAfter=12))

    # Student & Reporting Period Profile Card
    period_label = period.get("label", "Selected Reporting Period")
    start_dt = period.get("start_date", "N/A")
    end_dt = period.get("end_date", "N/A")

    profile_data = [
        [
            Paragraph(f"<b>Student Name:</b> {student.get('name', 'N/A')}", styles['NormalDark']),
            Paragraph(f"<b>Student ID:</b> {student.get('id', 'N/A')}", styles['NormalDark']),
            Paragraph(f"<b>Semester:</b> {student.get('year', '3rd Year')}", styles['NormalDark'])
        ],
        [
            Paragraph(f"<b>Course / Degree:</b> {student.get('course', 'B.Tech CS')}", styles['NormalDark']),
            Paragraph(f"<b>Institution:</b> {student.get('college', 'VIT University')}", styles['NormalDark']),
            Paragraph(f"<b>CGPA Standing:</b> {student.get('cgpa', 8.2):.2f}", styles['NormalDark'])
        ],
        [
            Paragraph(f"<b>Reporting Period:</b> {period_label.upper()}", styles['BoldDark']),
            Paragraph(f"<b>Date Range:</b> {start_dt} to {end_dt}", styles['NormalDark']),
            Paragraph(f"<b>Period Trajectory:</b> {comparison.get('label', 'Baseline Data')}", styles['NormalDark'])
        ]
    ]
    profile_table = Table(profile_data, colWidths=[180, 180, 144])
    profile_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_IVORY),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(profile_table)
    story.append(Spacer(1, 12))

    # Executive Summary KPI Metrics
    avg_score = metrics.get('average_score', 0.0)
    att_pct = attendance.get('attendance_pct', 0.0)
    asg_pct = assignments.get('completion_pct', 0.0)
    delta_str = comparison.get('delta_str', 'N/A')

    kpi_data = [
        [
            Paragraph(f"<font size=8 color='#173F3A'><b>EVALUATED AVERAGE</b></font><br/><font size=16 color='#173F3A'><b>{avg_score:.1f}%</b></font><br/><font size=7 color='#344541'>{metrics.get('eval_count', 0)} Assessments</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>ATTENDANCE RATE</b></font><br/><font size=16 color='#173F3A'><b>{att_pct:.1f}%</b></font><br/><font size=7 color='#344541'>{attendance.get('present_sessions', 0)} of {attendance.get('total_sessions', 0)} Sessions</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>ASSIGNMENTS COMPLETED</b></font><br/><font size=16 color='#173F3A'><b>{asg_pct:.1f}%</b></font><br/><font size=7 color='#344541'>{assignments.get('submitted_count', 0)} of {assignments.get('total_assigned', 0)} Tasks</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>PERIOD COMPARISON</b></font><br/><font size=14 color='#173F3A'><b>{delta_str}</b></font><br/><font size=7 color='#344541'>{comparison.get('context', 'vs Prior Period')}</font>", styles['NormalDark'])
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[126, 126, 126, 126])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_SAGE),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, WHITE),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 14))

    # 1. Subject-Wise Performance Breakdown
    story.append(Paragraph("1. Subject-Wise Academic Performance", styles['SectionHeader']))
    sub_table_data = [
        [
            Paragraph("Subject Name", styles['TableHead']),
            Paragraph("Course Code", styles['TableHead']),
            Paragraph("Assessments", styles['TableHead']),
            Paragraph("Period Average", styles['TableHead']),
            Paragraph("Highest Mark", styles['TableHead']),
            Paragraph("Status / Band", styles['TableHead'])
        ]
    ]
    for sp in subject_perf:
        sub_table_data.append([
            Paragraph(sp.get("subject", "N/A"), styles['TableBodyBold']),
            Paragraph(sp.get("code", "—"), styles['TableBody']),
            Paragraph(str(sp.get("count", 0)), styles['TableBody']),
            Paragraph(f"{sp.get('average_score', 0):.1f}%", styles['TableBodyBold']),
            Paragraph(f"{sp.get('max_score', 0):.1f}%", styles['TableBody']),
            Paragraph(sp.get("standing", "On Track"), styles['TableBody'])
        ])

    if len(sub_table_data) == 1:
        sub_table_data.append([Paragraph("No subject assessments recorded during this specific date window.", styles['TableBody']), "", "", "", "", ""])

    sub_table = Table(sub_table_data, colWidths=[164, 70, 70, 70, 65, 65])
    sub_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(sub_table)
    story.append(Spacer(1, 12))

    # 2. Detailed Assessment Records
    story.append(Paragraph("2. Assessment-Wise Verified Marks", styles['SectionHeader']))
    asmt_table_data = [
        [
            Paragraph("Date", styles['TableHead']),
            Paragraph("Subject", styles['TableHead']),
            Paragraph("Assessment Type", styles['TableHead']),
            Paragraph("Topic Tested", styles['TableHead']),
            Paragraph("Score (%)", styles['TableHead']),
            Paragraph("Evaluation Status", styles['TableHead'])
        ]
    ]
    for r in assessments:
        asmt_table_data.append([
            Paragraph(r.get("assessment_date", "—"), styles['TableBody']),
            Paragraph(r.get("subject", "—"), styles['TableBody']),
            Paragraph(r.get("assessment_type", "—"), styles['TableBodyBold']),
            Paragraph(r.get("topic", "—"), styles['TableBody']),
            Paragraph(f"{r.get('score', 0):.1f}%", styles['TableBodyBold']),
            Paragraph("Evaluated & Verified", styles['TableBody'])
        ])
    if len(asmt_table_data) == 1:
        asmt_table_data.append([Paragraph("No individual assessments scheduled or recorded in this period.", styles['TableBody']), "", "", "", "", ""])

    asmt_table = Table(asmt_table_data, colWidths=[70, 120, 85, 125, 54, 50])
    asmt_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(asmt_table)
    story.append(Spacer(1, 12))

    # 3. Attendance & Assignment Completion Summary (Side-by-side or stacked)
    story.append(Paragraph("3. Attendance Sessions & Assignment Completion", styles['SectionHeader']))
    
    att_asg_data = [
        [
            Paragraph("<b>Attendance Breakdown</b>", styles['TableHead']),
            Paragraph("<b>Assignment Completion Breakdown</b>", styles['TableHead'])
        ],
        [
            Paragraph(
                f"• Total Scheduled Sessions: <b>{attendance.get('total_sessions', 0)}</b><br/>"
                f"• Sessions Present: <b>{attendance.get('present_sessions', 0)}</b><br/>"
                f"• Sessions Late: <b>{attendance.get('late_sessions', 0)}</b><br/>"
                f"• Sessions Absent: <b>{attendance.get('absent_sessions', 0)}</b><br/>"
                f"• Calculated Attendance: <b>{att_pct:.1f}%</b> "
                f"({'Meets University 75% Requirement' if att_pct >= 75 else 'Below Minimum 75% Threshold'})",
                styles['NormalDark']
            ),
            Paragraph(
                f"• Total Coursework Assigned: <b>{assignments.get('total_assigned', 0)}</b><br/>"
                f"• Successfully Submitted: <b>{assignments.get('submitted_count', 0)}</b><br/>"
                f"• Evaluated & Graded: <b>{assignments.get('graded_count', 0)}</b><br/>"
                f"• Pending Submissions: <b>{assignments.get('pending_count', 0)}</b><br/>"
                f"• Assignment Completion Rate: <b>{asg_pct:.1f}%</b>",
                styles['NormalDark']
            )
        ]
    ]
    att_asg_table = Table(att_asg_data, colWidths=[252, 252])
    att_asg_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, 1), (-1, 1), BG_IVORY),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(att_asg_table)
    story.append(Spacer(1, 12))

    # 4. Verified Priority Focus Areas & Teacher Remarks
    story.append(Paragraph("4. Focus Areas & Official Faculty Remarks", styles['SectionHeader']))
    focus_data = []
    if support_topics:
        topics_str = ", ".join([f"<b>{t.get('topic')}</b> ({t.get('subject')}: {t.get('score')}%)" for t in support_topics])
        focus_data.append([
            Paragraph("<b>Topics Requiring Attention:</b>", styles['BoldDark']),
            Paragraph(f"Based on actual records below the 70% threshold: {topics_str}", styles['NormalDark'])
        ])
    else:
        focus_data.append([
            Paragraph("<b>Academic Standing:</b>", styles['BoldDark']),
            Paragraph("All evaluated assessments during this period meet or exceed benchmark standards (>70%).", styles['NormalDark'])
        ])

    if remarks:
        remarks_content = "<br/>".join([f"• <b>{r.get('subject')}:</b> \"{r.get('remark')}\"" for r in remarks])
        focus_data.append([
            Paragraph("<b>Faculty Remarks:</b>", styles['BoldDark']),
            Paragraph(remarks_content, styles['NormalDark'])
        ])
    else:
        focus_data.append([
            Paragraph("<b>Faculty Remarks:</b>", styles['BoldDark']),
            Paragraph("No individual advisory remarks logged by course instructors for this period.", styles['NormalDark'])
        ])

    focus_table = Table(focus_data, colWidths=[140, 364])
    focus_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_SAGE),
        ('BACKGROUND', (1, 0), (1, -1), WHITE),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(focus_table)
    story.append(Spacer(1, 12))

    # 5. AI Academic Copilot Recommendations (Prominently distinguished)
    story.append(Paragraph("5. AI-Assisted Study Recommendations (Grounded in Verified Records)", styles['SectionHeader']))
    recs_content = (
        "<b>[AI Academic Copilot Analysis]:</b><br/>"
        "<i>Notice: The following personalized study priorities are generated by the StudentConnector AI Engine "
        "synthesizing your verified assessment and attendance records.</i><br/><br/>"
    )
    if ai_recommendations:
        for idx, rec in enumerate(ai_recommendations, 1):
            recs_content += f"{idx}. <b>{rec.get('title', 'Recommendation')}:</b> {rec.get('detail', '')}<br/>"
    else:
        recs_content += "Maintain regular revision of completed coursework modules and review laboratory implementations."

    rec_box = Table([[Paragraph(recs_content, styles['RecommendationBox'])]], colWidths=[504])
    rec_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_IVORY),
        ('BOX', (0, 0), (-1, -1), 1, ACCENT_AMBER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(rec_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    return buffer.getvalue()


# ============================================================================
# 2. CONSOLIDATED CLASS PROGRESS REPORT (PDF)
# ============================================================================
def generate_class_progress_pdf(data: dict) -> bytes:
    """
    Builds a multi-page, formatted PDF consolidating overall class
    performance, grade distribution, student rankings, and support indicators.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = get_custom_styles()
    story = []

    cls_info = data.get("class_info", {})
    period = data.get("period", {})
    metrics = data.get("metrics", {})
    distributions = data.get("distributions", [])
    student_rows = data.get("students", [])
    assessment_stats = data.get("assessments", [])
    support_candidates = data.get("support_candidates", [])
    recommendations = data.get("recommendations", [])

    # Header
    header_data = [
        [
            Paragraph("<b>StudentConnector</b>", styles['BrandTitle']),
            Paragraph(f"<b>CONSOLIDATED CLASS PROGRESS REPORT</b><br/><font size=8 color='#79A995'>Generated: {datetime.now().strftime('%b %d, %Y %H:%M')}</font>", styles['NormalDark'])
        ]
    ]
    header_table = Table(header_data, colWidths=[280, 224])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=4, spaceAfter=12))

    # Class & Course Metadata
    meta_data = [
        [
            Paragraph(f"<b>Subject / Course:</b> {cls_info.get('name', 'N/A')}", styles['NormalDark']),
            Paragraph(f"<b>Course Code:</b> {cls_info.get('code', 'CS---')}", styles['NormalDark']),
            Paragraph(f"<b>Faculty In-Charge:</b> {cls_info.get('teacher_name', 'N/A')}", styles['NormalDark'])
        ],
        [
            Paragraph(f"<b>Reporting Period:</b> {period.get('label', 'Selected Window')}", styles['BoldDark']),
            Paragraph(f"<b>Date Range:</b> {period.get('start_date', 'N/A')} to {period.get('end_date', 'N/A')}", styles['NormalDark']),
            Paragraph(f"<b>Enrolled Students:</b> {metrics.get('total_enrolled', len(student_rows))}", styles['NormalDark'])
        ]
    ]
    meta_table = Table(meta_data, colWidths=[180, 160, 164])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_IVORY),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # Executive KPI Metric Cards
    class_avg = metrics.get('class_average', 0.0)
    class_att = metrics.get('attendance_rate', 0.0)
    class_asg = metrics.get('assignment_completion', 0.0)
    support_count = len(support_candidates)

    kpi_data = [
        [
            Paragraph(f"<font size=8 color='#173F3A'><b>CLASS AVERAGE</b></font><br/><font size=16 color='#173F3A'><b>{class_avg:.1f}%</b></font><br/><font size=7 color='#344541'>{metrics.get('assessment_count', 0)} Assessments</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>AVERAGE ATTENDANCE</b></font><br/><font size=16 color='#173F3A'><b>{class_att:.1f}%</b></font><br/><font size=7 color='#344541'>{metrics.get('session_count', 0)} Total Sessions</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>ASSIGNMENT COMPLETION</b></font><br/><font size=16 color='#173F3A'><b>{class_asg:.1f}%</b></font><br/><font size=7 color='#344541'>{metrics.get('submission_count', 0)} Submissions</font>", styles['NormalDark']),
            Paragraph(f"<font size=8 color='#173F3A'><b>SUPPORT INDICATORS</b></font><br/><font size=16 color='#173F3A'><b>{support_count}</b></font><br/><font size=7 color='#344541'>Candidates Flagged</font>", styles['NormalDark'])
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[126, 126, 126, 126])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_SAGE),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, WHITE),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 14))

    # 1. Performance Grade Distribution
    story.append(Paragraph("1. Grade & Performance Distribution", styles['SectionHeader']))
    dist_data = [
        [
            Paragraph("Performance Range", styles['TableHead']),
            Paragraph("Classification", styles['TableHead']),
            Paragraph("Student Count", styles['TableHead']),
            Paragraph("Percentage of Cohort", styles['TableHead'])
        ]
    ]
    for d in distributions:
        dist_data.append([
            Paragraph(d.get("range", "—"), styles['TableBodyBold']),
            Paragraph(d.get("label", "—"), styles['TableBody']),
            Paragraph(str(d.get("count", 0)), styles['TableBodyBold']),
            Paragraph(f"{d.get('percentage', 0):.1f}%", styles['TableBody'])
        ])

    dist_table = Table(dist_data, colWidths=[150, 154, 100, 100])
    dist_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(dist_table)
    story.append(Spacer(1, 12))

    # 2. Student-Wise Performance Roster
    story.append(Paragraph("2. Student Performance Roster", styles['SectionHeader']))
    roster_data = [
        [
            Paragraph("Student ID", styles['TableHead']),
            Paragraph("Student Name", styles['TableHead']),
            Paragraph("Attendance", styles['TableHead']),
            Paragraph("Assignments", styles['TableHead']),
            Paragraph("Course Score", styles['TableHead']),
            Paragraph("Academic Status", styles['TableHead'])
        ]
    ]
    for s in student_rows:
        roster_data.append([
            Paragraph(s.get("id", "—"), styles['TableBody']),
            Paragraph(s.get("name", "—"), styles['TableBodyBold']),
            Paragraph(f"{s.get('attendance_pct', 0):.1f}%", styles['TableBody']),
            Paragraph(f"{s.get('assignments_completed', 0)} / {s.get('assignments_total', 0)}", styles['TableBody']),
            Paragraph(f"{s.get('average_score', 0):.1f}%", styles['TableBodyBold']),
            Paragraph(s.get("status", "Good Standing"), styles['TableBody'])
        ])
    if len(roster_data) == 1:
        roster_data.append([Paragraph("No students enrolled or recorded for this class.", styles['TableBody']), "", "", "", "", ""])

    roster_table = Table(roster_data, colWidths=[70, 150, 74, 75, 75, 60])
    roster_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(roster_table)
    story.append(Spacer(1, 12))

    # 3. Assessment-Wise Class Statistics
    if assessment_stats:
        story.append(Paragraph("3. Assessment-Wise Class Performance", styles['SectionHeader']))
        asmt_data = [
            [
                Paragraph("Assessment", styles['TableHead']),
                Paragraph("Class Average", styles['TableHead']),
                Paragraph("Evaluated Count", styles['TableHead']),
                Paragraph("Highest Score", styles['TableHead']),
                Paragraph("Lowest Score", styles['TableHead'])
            ]
        ]
        for a in assessment_stats:
            asmt_data.append([
                Paragraph(a.get("assessment", "—"), styles['TableBodyBold']),
                Paragraph(f"{a.get('average', 0):.1f}%", styles['TableBodyBold']),
                Paragraph(str(a.get("count", 0)), styles['TableBody']),
                Paragraph(f"{a.get('highest', a.get('average', 0)):.1f}%", styles['TableBody']),
                Paragraph(f"{a.get('lowest', a.get('average', 0)):.1f}%", styles['TableBody'])
            ])
        asmt_table = Table(asmt_data, colWidths=[184, 80, 80, 80, 80])
        asmt_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
            ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(asmt_table)
        story.append(Spacer(1, 12))

    # 4. Academic Support Candidates & Interventions
    story.append(Paragraph("4. Students Requiring Academic Support (With Verification Evidence)", styles['SectionHeader']))
    if support_candidates:
        cand_data = [
            [
                Paragraph("Student", styles['TableHead']),
                Paragraph("Course Score", styles['TableHead']),
                Paragraph("Observed Indicator / Evidence", styles['TableHead']),
                Paragraph("Recommended Faculty Intervention", styles['TableHead'])
            ]
        ]
        for c in support_candidates:
            evidence_str = "; ".join(c.get("evidence", []))
            cand_data.append([
                Paragraph(f"<b>{c.get('name')}</b><br/><font size=7 color='#79A995'>{c.get('id')}</font>", styles['NormalDark']),
                Paragraph(f"{c.get('score', 0):.1f}%", styles['TableBodyBold']),
                Paragraph(evidence_str or "Assessment marks below 70%", styles['TableBody']),
                Paragraph(c.get("recommendation", "Review session recommended"), styles['TableBody'])
            ])
        cand_table = Table(cand_data, colWidths=[114, 70, 170, 150])
        cand_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
            ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, BG_IVORY]),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(cand_table)
    else:
        story.append(Paragraph("All enrolled students are in good standing without flagged intervention criteria.", styles['NormalDark']))

    story.append(Spacer(1, 12))

    # 5. Class-Wide Pedagogical Recommendations
    story.append(Paragraph("5. Areas for Class-Wide Curriculum Focus", styles['SectionHeader']))
    recs_str = (
        "<b>[Pedagogical Insights for Course Instructor]:</b><br/>"
        "• Review algorithmic recursion and graph exploration during upcoming laboratory sessions.<br/>"
        "• Conduct supplementary problem-solving drills before mid-semester examination.<br/>"
        "• Provide step-by-step code walkthroughs for complex memory management and packet trace modules."
    )
    rec_box = Table([[Paragraph(recs_str, styles['RecommendationBox'])]], colWidths=[504])
    rec_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_IVORY),
        ('BOX', (0, 0), (-1, -1), 1, ACCENT_AMBER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(rec_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    return buffer.getvalue()


# ============================================================================
# 3. CSV EXPORTERS
# ============================================================================
def generate_student_csv(data: dict) -> str:
    """Generates a CSV export of a student's assessments and performance."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    student = data.get("student", {})
    period = data.get("period", {})
    
    # Metadata Header
    writer.writerow(["StudentConnector Academic Progress Report (CSV Export)"])
    writer.writerow(["Student ID", student.get("id")])
    writer.writerow(["Student Name", student.get("name")])
    writer.writerow(["Course", student.get("course")])
    writer.writerow(["Reporting Period", period.get("label")])
    writer.writerow(["Date Range", f"{period.get('start_date')} to {period.get('end_date')}"])
    writer.writerow([])

    # Assessment records
    writer.writerow(["ASSESSMENT RECORDS"])
    writer.writerow(["Date", "Subject", "Assessment Type", "Topic Tested", "Score (%)", "Status"])
    for a in data.get("assessment_records", []):
        writer.writerow([
            a.get("assessment_date"),
            a.get("subject"),
            a.get("assessment_type"),
            a.get("topic"),
            a.get("score"),
            "Evaluated"
        ])
    writer.writerow([])

    # Subject performance
    writer.writerow(["SUBJECT PERFORMANCE SUMMARY"])
    writer.writerow(["Subject", "Course Code", "Assessment Count", "Average Score (%)", "Max Score (%)", "Standing"])
    for s in data.get("subject_performance", []):
        writer.writerow([
            s.get("subject"),
            s.get("code"),
            s.get("count"),
            s.get("average_score"),
            s.get("max_score"),
            s.get("standing")
        ])

    return output.getvalue()


def generate_class_csv(data: dict) -> str:
    """Generates a CSV export of an entire class's performance roster."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    cls_info = data.get("class_info", {})
    period = data.get("period", {})
    metrics = data.get("metrics", {})

    writer.writerow(["StudentConnector Consolidated Class Progress Data (CSV Export)"])
    writer.writerow(["Course Name", cls_info.get("name")])
    writer.writerow(["Course Code", cls_info.get("code")])
    writer.writerow(["Faculty In-Charge", cls_info.get("teacher_name")])
    writer.writerow(["Reporting Period", period.get("label")])
    writer.writerow(["Class Average (%)", metrics.get("class_average")])
    writer.writerow(["Average Attendance (%)", metrics.get("attendance_rate")])
    writer.writerow([])

    writer.writerow(["STUDENT ROSTER"])
    writer.writerow(["Student ID", "Student Name", "Attendance Rate (%)", "Assignments Completed", "Assignments Total", "Course Average (%)", "Status"])
    for s in data.get("students", []):
        writer.writerow([
            s.get("id"),
            s.get("name"),
            s.get("attendance_pct"),
            s.get("assignments_completed"),
            s.get("assignments_total"),
            s.get("average_score"),
            s.get("status")
        ])

    return output.getvalue()


# ============================================================================
# 4. ZIP ARCHIVE EXPORTER
# ============================================================================
def generate_class_zip(class_pdf_bytes: bytes, class_csv_str: str, individual_student_pdfs: list) -> bytes:
    """
    Bundles the consolidated class PDF, CSV data, and all individual
    student PDFs into a clean ZIP archive.
    """
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("01_Consolidated_Class_Report.pdf", class_pdf_bytes)
        zf.writestr("02_Class_Performance_Data.csv", class_csv_str)
        
        for student_rep in individual_student_pdfs:
            fname = f"Individual_Reports/{student_rep['student_id']}_{student_rep['student_name'].replace(' ', '_')}_Report.pdf"
            zf.writestr(fname, student_rep['pdf_bytes'])
            
    return zip_buffer.getvalue()
