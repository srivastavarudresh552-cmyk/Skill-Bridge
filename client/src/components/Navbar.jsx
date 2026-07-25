export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <span className="text-xl font-bold text-indigo-600">SkillBridge</span>
      <div className="flex gap-4 text-sm text-gray-600">
        <span>Dashboard</span>
        <span>Profile</span>
      </div>
    </nav>
  );
}