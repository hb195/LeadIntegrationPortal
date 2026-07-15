import LeadForm from './components/LeadForm/LeadForm'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  const isDashboard = window.location.pathname.startsWith('/dashboard')
  return isDashboard ? <Dashboard /> : <LeadForm />
}

export default App
