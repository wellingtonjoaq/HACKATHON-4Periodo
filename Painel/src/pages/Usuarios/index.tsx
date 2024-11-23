import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useEffect, useState } from "react";
import { IToken } from "../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../services/token";
import { Loading } from "../../components/Loading";
import axios from "axios";

interface IUsuarios {
    id: number;
    nome: string;
    email: string;
    permissoes: string;
}

export default function Usuarios() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dadosUsuarios, setDadosUsuarios] = useState<Array<IUsuarios>>([]);
    const [filtro, setFiltro] = useState<string>("");

    useEffect(() => {
        let lsStorage = localStorage.getItem("americanos.token");

        let token: IToken | null = null;

        if (typeof lsStorage === "string") {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        if (!validaPermissao(["admin", "professor"], token?.user.permissoes)) {
            navigate("/usuarios");
        }

        console.log("Pode desfrutar do sistema :D");

        setLoading(true);
        axios
            .get("http://localhost:3001/users")
            .then((res) => {
                setDadosUsuarios(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    const usuariosFiltrados = dadosUsuarios.filter((usuario) => {
        if (!filtro) return true;
        return usuario.permissoes === filtro;
    });

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
            <div
                className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3"
                style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid black",
                }}
            >
                <div
                    className="d-flex flex-column align-items-center mb-3 mb-md-0"
                    style={{
                        padding: "8px",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        fill="currentColor"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                    >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path
                            fillRule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                        />
                    </svg>
                    <h1 className="h2 mt-2">Usuários</h1>
                </div>

                <div
                    className="d-flex flex-column flex-md-row align-items-center ms-auto"
                    style={{
                        padding: "20px",
                    }}
                >
                    <div className="dropdown me-3">
                        <button
                            type="button"
                            className="btn btn-dark btn-lg dropdown-toggle"
                            id="dropdownFiltro"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{
                                width: "250px",
                                textAlign: "center",
                            }}
                        >
                            Filtrar
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-caret-down ms-2"
                                viewBox="0 0 16 16"
                            ></svg>
                        </button>
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownFiltro"
                            style={{
                                textAlign: "center",
                                width: "250px",
                            }}
                        >
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setFiltro("admin")}
                                >
                                    Admin
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setFiltro("professor")}
                                >
                                    Professor
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setFiltro("")}
                                >
                                    Todos
                                </button>
                            </li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        className="btn btn-success btn-lg mt-3 mt-md-0"
                        style={{
                            width: "180px",
                            marginRight: "10px", 
                        }}
                        onClick={() => {
                            navigate("/usuarios/criar");
                        }}
                    >
                        Adicionar
                    </button>
                </div>
            </div>


                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Email</th>
                                <th scope="col">Papel</th>
                                <th
                                    scope="col"
                                    className="text-end"
                                    style={{ paddingRight: "60px" }}
                                >
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((usuario, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{usuario.id}</th>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.permissoes}</td>
                                        <td
                                            className="text-end"
                                            style={{ paddingRight: "20px" }}
                                        >
                                            <button
                                                className="btn btn-warning"
                                                type="button"
                                                style={{ marginRight: "10px" }}
                                                onClick={() => {
                                                    navigate(`/usuarios/${usuario.id}`);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button className="btn btn-danger" type="button">
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </LayoutDashboard>
        </>
    );
}