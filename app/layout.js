import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="  mx-auto">
          <div className="">{children}</div>
        
      </body>
    </html>
  );
}
