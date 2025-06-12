import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastContainer, toast } from 'react-toastify';

const Enquiryy = () => {
  let [enquiryList, setEnquiryList] = useState([]);
  let [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    _id: ''
  });
  let [loading, setLoading] = useState(false);

  const getAllEnquiries = useCallback(() => {
    setLoading(true);
    axios
      .get('http://localhost:8000/api/website/enquiry/view')
      .then((res) => {
        if (res.data.status === 1) {
          setEnquiryList(res.data.enquiryList);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllEnquiries();
  }, [getAllEnquiries]);

  let editRow = (editId) => {
    axios.get(`http://localhost:8000/api/website/enquiry/single/${editId}`).then((res) => {
      let data = res.data;
      setFormData(data.enquiry);
    });
  };

  let deleteRow = (delId) => {
    Swal.fire({
      title: "Do you want to delete the record?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading(); // Show loading indicator
        axios
          .delete(`http://localhost:8000/api/website/enquiry/delete/${delId}`)
          .then((res) => {
            Swal.fire("Deleted!", "The enquiry has been deleted.", "success");
            toast.success("Enquiry Deleted Successfully");
            getAllEnquiries();
          })
          .catch((err) => {
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  let saveEnquiry = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    if (formData._id) {
      axios
        .put(`http://localhost:8000/api/website/enquiry/update/${formData._id}`, formData)
        .then((res) => {
          toast.success("Enquiry Updated Successfully");
          setFormData({ name: "", email: "", phone: "", message: "", _id: "" });
          getAllEnquiries();
        })
        .catch((error) => {
          toast.error("Error updating enquiry. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post("http://localhost:8000/api/website/enquiry/insert", formData)
        .then((res) => {
          if (res.data.status === 0 && res.data.error?.code === 11000) {
            toast.error("This email has already been used for an enquiry.");
          } else {
            toast.success("Enquiry saved successfully.");
            setFormData({ name: "", email: "", phone: "", message: "" });
            getAllEnquiries();
          }
        })
        .catch((error) => {
          toast.error("Something went wrong while submitting your enquiry.");
        })
        .finally(() => setLoading(false));
    }
  };

  let getValue = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;
    let oldData = { ...formData };
    oldData[inputName] = inputValue;
    setFormData(oldData);
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-6 flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-[40%_auto] gap-10 items-start">
          <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl p-8 transition-all hover:shadow-[0_10px_60px_-15px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl font-extrabold text-purple-800 mb-6 text-center animate-fade-in">💌 Enquiry Form</h2>

            <form className="space-y-5 animate-slide-up" onSubmit={saveEnquiry}>
              <div>
                <p>{formData._id}</p>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={getValue}
                  className="mt-1 w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="e.g. Ahmad"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={getValue}
                  className="mt-1 w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="e.g. ahmad@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Your Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={getValue}
                  className="mt-1 w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="e.g. 0300-1234567"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Your Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={getValue}
                  className="mt-1 w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 transition-all duration-300"
                disabled={loading} // Disable button while loading
              >
                {formData._id ? '✉️ Update Enquiry' : '✉️ Submit Enquiry'}
              </button>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-slide-up">
            <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">📋 Enquiry Table</h2>

            <div className="overflow-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-purple-100 text-purple-700 text-left">
                  <tr>
                    <th className="px-6 py-3 font-bold">Sr No</th>
                    <th className="px-6 py-3 font-bold">Name</th>
                    <th className="px-6 py-3 font-bold">Email</th>
                    <th className="px-6 py-3 font-bold">Phone</th>
                    <th className="px-6 py-3 font-bold">Message</th>
                    <th className="px-6 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiryList.length >= 1 ? (
                    enquiryList.map((item, index) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">{item.phone}</td>
                        <td className="px-6 py-4">{item.message}</td>
                        <td className="px-6 py-4 flex space-x-3">
                          <button
                            onClick={() => deleteRow(item._id)}
                            className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => editRow(item._id)}
                            className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4" colSpan="6">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Enquiryy;

