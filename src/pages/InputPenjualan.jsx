import { useEffect, useState } from "react";

export default function InputPenjualan() {

    const [brands, setBrands] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [wilayah, setWilayah] = useState([]);

    const [formData, setFormData] = useState({

    id_brand: "",
    id_kategori: "",
    id_wilayah: "",
    id_user: JSON.parse(localStorage.getItem("user")).id_user,
    nama_produk: "",
    nama_toko: "",
    jumlah: "",
    harga: "",
    tanggal_penjualan: "",

});

    useEffect(() => {

        fetch("http://localhost:5000/api/brand")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setBrands(result.data);
                }
            });

        fetch("http://localhost:5000/api/kategori")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setKategori(result.data);
                }
            });

        fetch("http://localhost:5000/api/wilayah")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setWilayah(result.data);
                }
            });

    }, []);

    const handleChange = (e) => {

    const { name, value } = e.target;

    const newData = {

        ...formData,

        [name]: value,

    };

    if (
        name === "jumlah" ||
        name === "harga"
    ) {

        const jumlah =
            Number(
                name === "jumlah"
                    ? value
                    : newData.jumlah
            );

        const harga =
            Number(
                name === "harga"
                    ? value
                    : newData.harga
            );

        newData.total = jumlah * harga;

    }

    setFormData(newData);

};

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/penjualan",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            alert(result.message);

            if (result.success) {

                setFormData({
    id_brand: "",
    id_kategori: "",
    id_wilayah: "",
    id_user: JSON.parse(localStorage.getItem("user")).id_user,

    nama_produk: "",
    nama_toko: "",

    jumlah: "",
    harga: "",

    tanggal_penjualan: "",
});

            }

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="p-8">

           <div className="mb-6">

    <h1 className="text-3xl font-bold">
        Input Penjualan
    </h1>

    <p className="text-gray-500 mt-2">
        Masukkan data penjualan yang dilakukan hari ini.
    </p>

</div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-5"
            >

                <div className="grid grid-cols-2 gap-5">

                    <div>

                        <label>Brand</label>

                        <select
                            name="id_brand"
                            value={formData.id_brand}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        >

                            <option value="">Pilih Brand</option>

                            {brands.map((item) => (

                                <option
                                    key={item.id_brand}
                                    value={item.id_brand}
                                >

                                    {item.nama_brand}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label>Kategori</label>

                        <select
                            name="id_kategori"
                            value={formData.id_kategori}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        >

                            <option value="">Pilih Kategori</option>

                            {kategori.map((item) => (

                                <option
                                    key={item.id_kategori}
                                    value={item.id_kategori}
                                >

                                    {item.nama_kategori}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label>Wilayah</label>

                        <select
                            name="id_wilayah"
                            value={formData.id_wilayah}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        >

                            <option value="">Pilih Wilayah</option>

                            {wilayah.map((item) => (

                                <option
                                    key={item.id_wilayah}
                                    value={item.id_wilayah}
                                >

                                    {item.nama_wilayah}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label>Nama Produk</label>

                        <input
                            type="text"
                            name="nama_produk"
                            value={formData.nama_produk}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />

                    </div>

                    <div>

                        <label>Nama Toko</label>

                        <input
                            type="text"
                            name="nama_toko"
                            value={formData.nama_toko}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />

                    </div>

                    <div>

                        <label>Jumlah</label>

                        <input
                            type="number"
                            name="jumlah"
                            value={formData.jumlah}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />

                    </div>

                    <div>

    <label>Harga Satuan</label>

    <input
        type="number"
        name="harga"
        value={formData.harga || ""}
        onChange={handleChange}
        className="border rounded-lg w-full p-2"
        required
    />

</div>

<div>

    <label>Total Penjualan</label>

    <input
        type="text"
        readOnly
        value={
            (
                Number(formData.jumlah || 0) *
                Number(formData.harga || 0)
            ).toLocaleString("id-ID")
        }
        className="border rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
    />

</div>


                    <div>

                        <label>Tanggal Penjualan</label>

                        <input
                            type="date"
                            name="tanggal_penjualan"
                            value={formData.tanggal_penjualan}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />

                    </div>

                </div>

               <div className="flex justify-end">

<button
    type="submit"
    className="bg-hijau hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow"
>

    Simpan Data Penjualan

</button>

</div>

            </form>

        </div>

    );

}