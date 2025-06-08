import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Roboto } from 'next/font/google'
import './globals.css'
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'VigorPet shop',
  description: 'For the love of pet',
}

export default function RootLayout({ children}) {
  
  return (
    <html className="scroll-smooth">
      <head>
        <meta charSet="UTF-8"/>
      </head>
      
        <body className={roboto.className}>
          <main className="max-w-6xl mx-auto p-4">
            <AppProvider>
              <Toaster />
              <Header />
              {children}
              <footer className="border-t p-8 text-center text-gray-500 mt-16">
                &copy; 2025 All rights reserved
              </footer>
            </AppProvider>
          </main>
        </body>
      
    </html>
  )
}
