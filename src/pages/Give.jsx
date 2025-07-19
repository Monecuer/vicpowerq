import React from "react";
import { FaCcVisa, FaMoneyBillWave } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import { MdPhoneIphone } from "react-icons/md"; // for EcoCash mobile look

export default function Give() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4 animate-pulse">
          Sow a Seed – Give to Victory Power Ministries
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          Your offering helps us reach more souls and grow God's kingdom. Thank you for your generosity!
        </p>

        {/* Payment Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Visa */}
          <div className="bg-gray-900 p-6 rounded-lg border border-purple-800 hover:scale-[1.02] transition shadow-lg">
            <FaCcVisa className="text-blue-400 text-4xl mb-2 mx-auto" />
            <h2 className="text-xl font-semibold">Visa / MasterCard</h2>
            <p className="text-gray-400 text-sm mt-2">
              Pay securely with any international or local bank card.
            </p>
            <button className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-full text-sm">
              Pay with Card
            </button>
          </div>

          {/* EcoCash */}
          <div className="bg-gray-900 p-6 rounded-lg border border-purple-800 hover:scale-[1.02] transition shadow-lg">
            <MdPhoneIphone className="text-yellow-400 text-4xl mb-2 mx-auto" />
            <h2 className="text-xl font-semibold">EcoCash (Zimbabwe)</h2>
            <p className="text-gray-400 text-sm mt-2">
              Dial *151# and use merchant code: <strong>123456</strong>
            </p>
            <button className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-full text-sm">
              View Instructions
            </button>
          </div>

          {/* Inbucks */}
          <div className="bg-gray-900 p-6 rounded-lg border border-purple-800 hover:scale-[1.02] transition shadow-lg">
            <GiReceiveMoney className="text-green-400 text-4xl mb-2 mx-auto" />
            <h2 className="text-xl font-semibold">Inbucks</h2>
            <p className="text-gray-400 text-sm mt-2">
              Send to username: <strong>@VictoryPower</strong>
            </p>
            <button className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-full text-sm">
              Copy Details
            </button>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-16 bg-purple-900 p-6 rounded-lg shadow-md">
          <RiSecurePaymentLine className="text-white text-4xl mb-2 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Thank You!</h2>
          <p className="text-gray-300 mt-2">
            May God bless you abundantly for your giving. Your seed makes a difference.
          </p>
        </div>
      </div>
    </div>
  );
}
