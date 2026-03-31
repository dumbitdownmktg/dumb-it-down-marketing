/*
  DUMB IT DOWN MARKETING — PDF BOOK GENERATOR
  Uses jsPDF to generate a full guide PDF on the fly.
  Add <script src="book.js"></script> and call downloadBook() from a button.
*/

function downloadBook() {
  const btn = document.getElementById('download-book-btn');
  if (btn) { btn.textContent = 'Generating...'; btn.disabled = true; }

  // Load jsPDF dynamically
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = function() { generatePDF(btn); };
  script.onerror = function() {
    alert('Could not load PDF library. Check your connection and try again.');
    if (btn) { btn.textContent = 'Download the Book (Free PDF)'; btn.disabled = false; }
  };
  document.head.appendChild(script);
}

function generatePDF(btn) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, M = 18, CW = W - M * 2;
  let y = 0;

  // ---- HELPERS ----
  function newPage() { doc.addPage(); y = 20; }
  function checkY(needed) { if (y + needed > 270) newPage(); }

  function heading1(text, color) {
    checkY(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(color || 15, color ? 0 : 15, color ? 0 : 15);
    doc.text(text, M, y);
    y += 12;
    doc.setDrawColor(15, 15, 15);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 8;
  }

  function heading2(text) {
    checkY(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 15, 15);
    doc.text(text, M, y);
    y += 8;
  }

  function heading3(text) {
    checkY(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(text.toUpperCase(), M, y);
    y += 6;
  }

  function body(text, indent) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const x = M + (indent || 0);
    const lines = doc.splitTextToSize(text, CW - (indent || 0));
    checkY(lines.length * 5 + 2);
    doc.text(lines, x, y);
    y += lines.length * 5 + 2;
  }

  function bullet(text) {
    checkY(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text('•', M + 2, y);
    const lines = doc.splitTextToSize(text, CW - 8);
    doc.text(lines, M + 7, y);
    y += lines.length * 5 + 1;
  }

  function callout(text, r, g, b) {
    checkY(16);
    doc.setFillColor(r || 242, g || 201, b || 76);
    doc.setDrawColor(r || 212, g || 168, b || 0);
    doc.rect(M, y - 4, CW, 12 + doc.splitTextToSize(text, CW - 8).length * 5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 15, 15);
    const lines = doc.splitTextToSize(text, CW - 8);
    doc.text(lines, M + 4, y + 1);
    y += lines.length * 5 + 10;
  }

  function spacer(n) { y += n || 6; }

  // ---- COVER ----
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 297, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor(242, 201, 76);
  doc.text('DUMB IT DOWN', M, 70);
  doc.text('MARKETING', M, 88);
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('The complete no-BS guide to marketing', M, 108);
  doc.text('for small business owners.', M, 116);
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Free. No fluff. Actually useful.', M, 140);
  doc.text('dumbitdownmarketing.netlify.app', M, 148);
  doc.setFontSize(9);
  doc.text('Built by Zach Maldonado — Austin, TX', M, 200);
  doc.text('Honor system: $49 on Venmo keeps this free for everyone.', M, 208);
  doc.text('venmo.com/u/zachary-maldonado-6', M, 216);
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const version = 'Generated ' + new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  doc.text(version, M, 280);

  // ---- CHAPTER 1: THE BASICS ----
  newPage();
  heading1('Chapter 1: The Marketing Funnel');
  body('Most businesses spend money on marketing without understanding where their customers are in the buying process. The funnel is the framework that fixes that.');
  spacer();
  heading2('TOFU — Top of Funnel (Awareness)');
  body('People who don\'t know you exist yet. Your job at this stage is to get on their radar without selling. Blog posts, social content, videos, ads to cold audiences.');
  spacer(4);
  heading2('MOFU — Middle of Funnel (Consideration)');
  body('People who know you and are interested but not ready to buy. Your job is to build trust and stay top of mind. Email nurture, retargeting, case studies, free resources.');
  spacer(4);
  heading2('BOFU — Bottom of Funnel (Decision)');
  body('People ready to buy right now. Make it as easy as possible to say yes. Free trials, consultations, strong offers, testimonials, clear guarantees.');
  spacer(4);
  heading2('After Purchase (Retention)');
  body('The most overlooked stage. Every happy client who refers one person is the cheapest lead you will ever get. Onboarding, check-ins, referral asks, loyalty programs.');
  spacer();
  callout('The rule: Different stages need completely different messages. Sending a "book now" ad to someone who has never heard of you is like proposing on a first date.');

  // ---- CHAPTER 2: THE NUMBERS ----
  newPage();
  heading1('Chapter 2: The Numbers That Matter');
  body('You cannot improve what you do not measure. These are the only numbers that actually tell you whether your marketing is working.');
  spacer();

  const metrics = [
    ['CAC — Customer Acquisition Cost', 'Total marketing spend divided by new customers. If you spent $2,000 and got 20 clients, your CAC is $100. Every decision you make should be measured against this number.'],
    ['LTV — Lifetime Value', 'Total revenue from one customer over their entire relationship with you. A gym member at $50/month who stays 18 months has an LTV of $900. Your CAC should always be significantly lower than your LTV.'],
    ['ROI — Return on Investment', 'How much you got back vs how much you put in. $500 spent, $2,000 returned = 4x ROI. The minimum acceptable ROI depends on your industry but 3x is a good starting benchmark.'],
    ['Close Rate', 'The percentage of leads who become clients. Industry average for most small businesses is 15 to 25%. Below 10% means there is a serious leak somewhere in your funnel.'],
    ['CPL — Cost Per Lead', 'How much you pay to get someone to raise their hand. Different from CAC because a lead is not a client yet. Know both numbers.'],
    ['CTR — Click Through Rate', 'The percentage of people who see your ad or email and click it. Tells you how compelling your message is. Low CTR usually means a subject line or headline problem.'],
  ];

  metrics.forEach(([title, desc]) => {
    heading3(title);
    body(desc, 4);
    spacer(3);
  });

  // ---- CHAPTER 3: EMAIL MARKETING ----
  newPage();
  heading1('Chapter 3: Email Marketing 101');
  body('Average ROI: $36 for every $1 spent. Higher than social media, paid search, and display ads combined. The businesses that win with email treat it like a conversation, not a megaphone.');
  spacer();

  heading2('The single biggest lever: Segmentation');
  body('Splitting your list into groups so each group gets a message that actually applies to them. A lead from Google is different from a referral. A new client is different from a lapsed one. When you send the same email to all of them, you are relevant to none of them.');
  spacer();
  callout('The rule: Before every email, ask "who exactly is this for?" If the answer is "everyone" — rethink the email.');
  spacer();

  heading2('The 5 automations every small business should turn on today');
  const autos = [
    ['Welcome sequence', '3-5 emails over 1-2 weeks. Triggered when someone joins your list. This is when they are most interested. Do not waste it.'],
    ['Lead nurture sequence', 'For leads who didn\'t book right away. Sends over 4-8 weeks. By the time they\'re ready to buy, you\'re the obvious choice.'],
    ['Appointment reminder', 'Confirmation immediately. Reminder 24 hours before. Morning-of text. Businesses that do this see show rates jump 20-30 points.'],
    ['Re-engagement sequence', 'Anyone who hasn\'t opened in 90 days gets a 3-email win-back. If they still don\'t engage, remove them. A clean list beats a big one.'],
    ['Post-purchase / onboarding', 'Triggered when someone becomes a client. Sets expectations, checks in, and at the peak of their happiness asks for a review and a referral.'],
  ];
  autos.forEach(([title, desc]) => {
    heading3(title);
    body(desc, 4);
    spacer(2);
  });

  spacer();
  heading2('The rules that actually matter');
  const rules = [
    'Subject lines win or lose it. Keep under 50 characters. Test two versions on every send.',
    'One email, one CTA. The more options you give people, the less likely they are to do any of them.',
    'Send consistently. Once a week beats once a month every time.',
    'Give before you ask. For every promotional email, send two that are purely useful.',
    'Clean your list quarterly. Remove anyone who hasn\'t opened in 90 days.',
    'Deliverability is a technical problem. Set up SPF, DKIM, and DMARC. Never buy a list.',
  ];
  rules.forEach(r => { bullet(r); spacer(1); });

  // ---- CHAPTER 4: AD BUDGET ----
  newPage();
  heading1('Chapter 4: Ad Budget Planning');
  body('More money does not mean more leads. How you split your budget matters more than how much you spend. The biggest mistake small businesses make is running one ad, waiting two weeks, declaring it dead, and quitting.');
  spacer();

  heading2('What to spend at each stage');
  const stages = [
    ['Just starting out (under $1,000/mo)', 'Pick two channels maximum. Spreading thin means nothing gets enough budget to learn. Every dollar right now is research — you are buying information, not leads.'],
    ['Actively growing ($1,000–$5,000/mo)', 'Double down on what is working before expanding. Add one new channel per quarter with 15-20% of budget. Test for 90 days minimum before judging.'],
    ['Scaling ($5,000+/mo)', 'Scaling is not just spending more. Watch your CAC closely. The moment cost per acquisition rises more than 20%, stop increasing spend and fix the funnel first.'],
  ];
  stages.forEach(([title, desc]) => {
    heading3(title);
    body(desc, 4);
    spacer(3);
  });

  heading2('The testing framework (the Hormozi approach)');
  body('Run 3-5 ad variations simultaneously. Change only ONE variable between each: the headline, the image, the CTA color, the first line of copy. After 2x the expected result timeline, cut the single worst performer. Replace it with a new variation that changes one thing from the current winner. You are always competing against your best. This is how you compound.');
  spacer();
  callout('The winner is always the person still testing. Most small businesses run one ad, wait 2 weeks, and quit. That is not a test. That is a coin flip.');

  heading2('Channel timelines — what to actually expect');
  const timelines = [
    ['Google Ads', '2-4 weeks', 'High intent. People searching for what you sell right now.'],
    ['Email Marketing', '3-6 weeks', 'Highest ROI. Works on leads you already have.'],
    ['Facebook / Meta', '4-8 weeks', 'Needs volume to learn. Give it 50+ conversions before judging.'],
    ['Instagram', '6-10 weeks', 'Awareness play. Video outperforms static 3 to 1.'],
    ['Referral Program', '8-12 weeks', 'Best quality leads. Ask at the peak of client happiness.'],
    ['SEO / Content', '6-12 months', 'Slow but compounds. Eventually your cheapest lead source.'],
  ];
  spacer();
  timelines.forEach(([ch, time, note]) => {
    checkY(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 15, 15);
    doc.text(ch, M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(212, 168, 0);
    doc.text(time, M + 45, y);
    y += 5;
    doc.setTextColor(100, 100, 100);
    body(note, 4);
    spacer(1);
  });

  // ---- CHAPTER 5: THE GLOSSARY ----
  newPage();
  heading1('Chapter 5: The Marketing Dictionary');
  body('Every term a marketer has ever thrown at you, explained in plain English with a real world example.');
  spacer();

  const glossary = [
    ['CAC', 'How much you spent to get one new paying customer.'],
    ['LTV', 'Total money a customer spends with you over their lifetime with your business.'],
    ['ROI', 'How much you got back vs how much you put in. $500 in, $2,000 back = 4x ROI.'],
    ['ROAS', 'ROI but specifically for ad spend. Used a lot in ecommerce.'],
    ['CTR', 'Percentage of people who saw your ad or email and clicked it.'],
    ['CPL', 'How much you paid to get one person to show interest. Not the same as a sale.'],
    ['CPC', 'Cost per click. How much you pay every time someone clicks your ad.'],
    ['CPM', 'Cost per 1,000 impressions. You pay whether or not anyone clicks.'],
    ['CRO', 'Conversion Rate Optimization. Making existing traffic convert better instead of getting more traffic.'],
    ['MQL', 'A lead your marketing team has decided is worth passing to sales.'],
    ['CTA', 'Call to Action. The thing you want someone to do next.'],
    ['KPI', 'Key Performance Indicator. A number you track to know if something is working.'],
    ['TOFU/MOFU/BOFU', 'Top, Middle, Bottom of Funnel. Where someone is in their buying journey.'],
    ['A/B Test', 'Showing two versions of something to different people to see which performs better.'],
    ['Churn', 'Customers who stop buying or cancel. High churn = leaky bucket.'],
    ['Retargeting', 'Ads shown specifically to people who already visited your website.'],
    ['Segmentation', 'Splitting your list into groups so each gets a relevant message.'],
    ['Drip Campaign', 'A series of automated emails sent on a schedule after someone takes an action.'],
    ['Deliverability', 'Whether your emails actually reach the inbox instead of spam.'],
    ['Lead Magnet', 'Something free you offer in exchange for someone\'s contact info.'],
  ];

  glossary.forEach(([term, def]) => {
    checkY(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 130, 0);
    doc.text(term, M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(def, CW - 35);
    doc.text(lines, M + 36, y);
    y += Math.max(lines.length * 5, 5) + 2;
  });

  // ---- BACK COVER ----
  newPage();
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 297, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(242, 201, 76);
  doc.text('If this helped you,', M, 80);
  doc.text('keep it free for the next person.', M, 92);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(160, 160, 160);
  y = 110;
  const backOptions = [
    '$49 on Venmo — once, forever. venmo.com/u/zachary-maldonado-6',
    'Share it with one business owner who needs it.',
    'Keep browsing for free. No judgment. That\'s okay too.',
  ];
  backOptions.forEach((opt, i) => {
    doc.setTextColor(242, 201, 76);
    doc.text((i + 1).toString(), M, y);
    doc.setTextColor(200, 200, 200);
    const lines = doc.splitTextToSize(opt, CW - 10);
    doc.text(lines, M + 8, y);
    y += lines.length * 7 + 4;
  });
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('dumbitdownmarketing.netlify.app', M, 260);
  doc.text('Built by Zach Maldonado — Austin, TX', M, 268);

  // ---- SAVE ----
  const filename = 'DumbItDown_Marketing_Guide_' + new Date().toISOString().slice(0,10) + '.pdf';
  doc.save(filename);

  if (btn) { btn.textContent = 'Download the Book (Free PDF)'; btn.disabled = false; }
}
