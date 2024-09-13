import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
 
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-600 to-purple-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <img src="/icons/citcomsfooter.png" alt="CITCOMS Logo" className="h-16 mb-4" />
            <p className="text-sm mb-4">
              ศูนย์บริการเทคโนโลยีสารสนเทศและการสื่อสารได้เปิดให้บริการ
              Self Training Room เพื่อใช้เป็นห้องฝึกการใช้งานบริการ
              ออนไลน์และระบบสารสนเทศต่างๆของมหาวิทยาลัย
              พร้อมบริการสอบมาตรฐานสากลด้าน IT
              และบริการห้องจัดฝึกอบรมทางคอมพิวเตอร์
            </p>
            <p className="text-sm mb-2">
              <strong>โทร:</strong> +66 054 466666 ext 2287-2288
            </p>
            <p className="text-sm mb-2">
              <strong>อีเมล:</strong> citcoms@up.ac.th
            </p>
            <p className="text-sm">
              ศูนย์บริการเทคโนโลยีสารสนเทศและการสื่อสาร : CITCOMS, มหาวิทยาลัยพะเยา 19 หมู่ 2
              ตำบลแม่กา อำเภอเมืองพะเยา จังหวัดพะเยา 56000
            </p>
          </div>
          <div className="md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">ติดต่อเรา</h3>
            <p className="text-sm mb-2">สอบถามเพิ่มเติมกับแอดมิน</p>
            <form className="flex items-center mb-4">
              <input
                type="text"
                placeholder="ถาม-ตอบ"
                className="flex-grow p-2 rounded-l-lg bg-purple-500 text-white placeholder-purple-200"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold py-2 px-4 rounded-r-lg hover:from-pink-500 hover:to-purple-600 transition duration-300"
              >
                Send
              </button>
            </form>
            <div className="flex mt-4 space-x-4">
              <a href="https://www.facebook.com/citcoms.up/" className="text-white hover:text-purple-200 transition duration-300">
                <FaFacebookF size={24} />
              </a>
              <a href="https://twitter.com/UP_university?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" className="text-white hover:text-purple-200 transition duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=citcoms@up.ac.th" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200 transition duration-300">
                <FaGoogle size={24} />
              </a>
              <a href="https://www.instagram.com/u_p_post/?img_index=1" className="text-white hover:text-purple-200 transition duration-300">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-purple-500 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-2 md:mb-0">
            <Link to="/privacy-policy" className="text-purple-200 hover:text-white mr-4">
              นโยบายการคุ้มครองข้อมูลส่วนบุคคล
            </Link>
            <Link to="/cookie-preferences" className="text-purple-200 hover:text-white">
              Cookie preferences
            </Link>
          </div>
          <div className="text-sm">
            © Copyrights 2024. All Rights Reserved.
            <Link to="/admin" className="text-purple-200 hover:text-white ml-2">
              Backend
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;