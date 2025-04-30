const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('examId');
fetch('data/exams.json')
  .then(res => res.json())
  .then(data => {
    const exam = data[examId];
    if (!exam) return document.body.innerHTML = '<h1>Exam not found</h1>';

    document.getElementById('exam-title').textContent = exam.title;
    const form = document.getElementById('exam-form');

    exam.questions.forEach((q, idx) => {
      const div = document.createElement('div');
      div.innerHTML = `<p>${q.question}</p>`;

      if (q.type === 'multiple-choice') {
        q.options.forEach(opt => {
          div.innerHTML += `<label><input type="radio" name="q${idx}" value="${opt}"> ${opt}</label><br>`;
        });
      } else if (q.type === 'text') {
        div.innerHTML += `<input type="text" name="q${idx}"><br>`;
      }
      form.appendChild(div);
    });

    const submit = document.createElement('button');
    submit.textContent = 'Submit';
    submit.type = 'submit';
    form.appendChild(submit);

    form.onsubmit = function(e) {
      e.preventDefault();
      let score = 0;
      exam.questions.forEach((q, idx) => {
        const answer = form[`q${idx}`].value.trim();
        if (answer.toLowerCase() === q.correct.toLowerCase()) score++;
      });
      document.getElementById('result').innerHTML = `<h2>Score: ${score} / ${exam.questions.length}</h2>`;
    }
  });
