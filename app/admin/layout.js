export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100  ">
    

      {/* Main Content */}
      <main className=" ">
        {children}
      </main>
    </div>
  );
}