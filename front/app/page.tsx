import PersonnelList from '../components/PersonnelList'
import PersonnelActionFAB from '../components/PersonnelActionFAB'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">人员名单</h1>
      <PersonnelList />
      <PersonnelActionFAB />
    </div>
  )
}

