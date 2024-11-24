import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "../../../components/Loading";
import { LayoutDashboard } from "../../../components/AdminDashboard";
import { IToken } from "../../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../../services/token";

interface IReserva {
    nome: string;
    espaco_id: number;
    usuario_id: number;
    data: string;
    horario_inicio: string;
    horario_fim: string;
    status: string;
}

interface IEspacos {
    id: number;
    nome: string;
}

interface IUsuarios {
    id: number;
    name: string;
    email: string;
    papel: string;
}

export default function AdicionarReserva() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dadosEspacos, setDadosEspacos] = useState<Array<IEspacos>>([]);
    const [dadosUsuarios, setDadosUsuarios] = useState<Array<IUsuarios>>([]);
    const [formData, setFormData] = useState<IReserva>({
        nome: "",
        espaco_id: 0,
        usuario_id: 0,
        data: "",
        horario_inicio: "",
        horario_fim: "",
        status: "ativa",
    });

    useEffect(() => {
        const lsStorage = localStorage.getItem("painel.token");
        let token: IToken | null = null;

        if (typeof lsStorage === "string") {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/"); // Redirect to login if token is expired or not present
        }

        if (!validaPermissao(["admin", "professor"], token?.user.papel)) {
            navigate("/reserva/criar"); // Redirect if permission is invalid
        }

        setLoading(true);

        // Fetch spaces (espacos) and users (usuarios)
        axios
            .get("http://localhost:3001/espaco")
            .then((response) => setDadosEspacos(response.data))
            .catch((err) => console.error("Erro ao buscar espaços", err));

        axios
            .get("http://localhost:3001/users")
            .then((response) => setDadosUsuarios(response.data))
            .catch((err) => console.error("Erro ao buscar usuários", err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Convert espaco_id and usuario_id to numbers when their value changes
        if (name === "espaco_id" || name === "usuario_id") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value), // Convert value to a number
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        axios
            .post("http://localhost:3001/reservas", formData)
            .then(() => {
                alert("Reserva adicionada com sucesso!");
                navigate("/reserva");
            })
            .catch((err) => {
                console.error("Erro ao adicionar reserva", err);
                alert("Erro ao adicionar reserva!");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="container mt-4">
                    <h1>Adicionar Reserva</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">
                                Nome Da Reserva
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                className="form-control"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="data" className="form-label">
                                Data
                            </label>
                            <input
                                type="date"
                                id="data"
                                name="data"
                                className="form-control"
                                value={formData.data}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="horario_inicio" className="form-label">
                                Horário de Início
                            </label>
                            <select
                                id="horario_inicio"
                                name="horario_inicio"
                                className="form-select"
                                value={formData.horario_inicio}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um horário de início</option>
                                <option value="19:00">19:00</option>
                                <option value="21:00">21:00</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="horario_fim" className="form-label">
                                Horário de Fim
                            </label>
                            <select
                                id="horario_fim"
                                name="horario_fim"
                                className="form-select"
                                value={formData.horario_fim}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um horário de fim</option>
                                <option value="20:40">20:40</option>
                                <option value="22:00">22:00</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="espaco_id" className="form-label">
                                Espaço
                            </label>
                            <select
                                id="espaco_id"
                                name="espaco_id"
                                className="form-select"
                                value={formData.espaco_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um espaço</option>
                                {dadosEspacos.map((espaco) => (
                                    <option key={espaco.id} value={espaco.id}>
                                        {espaco.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="usuario_id" className="form-label">
                                Usuário
                            </label>
                            <select
                                id="usuario_id"
                                name="usuario_id"
                                className="form-select"
                                value={formData.usuario_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um usuário</option>
                                {dadosUsuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.name} ({usuario.papel})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Adicionar Reserva
                        </button>
                    </form>
                </div>
            </LayoutDashboard>
        </>
    );
}
