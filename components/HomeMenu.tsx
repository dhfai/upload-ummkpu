import Link from "next/link";

export default function HomeMenu() {
    const files = [
        "bantaeng.xlsx",
        "barru.xlsx",
        "bone.xlsx",
        "bulukumba.xlsx",
        "enrekang.xlsx",
        "gowa.xlsx",
        "jepot.xlsx",
        "luwu_timur.xlsx",
        "luwu_utara.xlsx",
        "luwu.xlsx",
        "maros.xlsx",
        "makassar.xlsx",
        "pangkep.xlsx",
        "pare_pare.xlsx",
        "pinrang.xlsx",
        "selayar.xlsx",
        "sidrap.xlsx",
        "sinjai.xlsx",
        "soppeng.xlsx",
        "takalar.xlsx",
        "toraja_utara.xlsx",
        "wajo.xlsx",
    ];

    return (
        <div className="container mx-auto mt-8 p-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                    <li key={file} className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-200">
                        <Link href={`/input-tps/${file}`} className="text-lg text-blue-600 hover:underline capitalize">
                            {file.replace(".xlsx", "")}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
