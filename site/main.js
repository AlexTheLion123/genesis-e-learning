// Set this to the URL that receives demo requests. Until it is set, the form
// validates but sends nothing, and says so.
const FORM_ENDPOINT = ''

window.__ready = true

const nav = document.getElementById('nav')
const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 24)
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

const menu = document.querySelector('.menu')
menu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) menu.removeAttribute('open')
})

const items = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
  items.forEach((el) => io.observe(el))
} else {
  items.forEach((el) => el.classList.add('in'))
}

const form = document.getElementById('demo-form')
const status = document.getElementById('form-status')
const showStatus = (kind, text) => { status.className = `status show ${kind}`; status.textContent = text }
const setError = (id, bad) => {
  const input = document.getElementById(id)
  const err = document.getElementById(`e-${id.replace('f-', '')}`)
  input.setAttribute('aria-invalid', bad ? 'true' : 'false')
  if (bad) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby')
  err.classList.toggle('show', bad)
  return bad
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const value = (id) => document.getElementById(id).value.trim()
  const bad = [
    setError('f-name', !value('f-name')),
    setError('f-bank', !value('f-bank')),
    setError('f-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('f-email'))),
  ]
  if (bad.includes(true)) {
    form.querySelector('[aria-invalid="true"]')?.focus()
    showStatus('info', 'Please check the highlighted fields.')
    return
  }
  if (!FORM_ENDPOINT) {
    showStatus('info', 'Preview only: this form is not connected yet, so nothing was sent.')
    return
  }
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('bad status')
    form.reset()
    showStatus('ok', 'Thank you. We will be in touch shortly to arrange a time.')
  } catch {
    showStatus('info', 'Sorry, that did not go through. Please try again, or write to us directly.')
  }
})
