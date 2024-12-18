import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "../../../components/Loading";
import { LayoutDashboard } from "../../../components/AdminDashboard";
import { IToken } from "../../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../../services/token";

interface IReserva {
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
    localidade: string;
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
        espaco_id: 0,
        usuario_id: 0,
        data: "",
        horario_inicio: "",
        horario_fim: "",
        status: "ativa",
    });

    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        let lsStorage = localStorage.getItem("painel.token");

        let token: IToken | null = null;

        if (typeof lsStorage === "string") {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        if (!validaPermissao(["admin"], token?.user.papel)) {
            navigate("/");
        }

        setLoading(true);

        axios
            .get('http://localhost:8000/api/espacos/')
            .then((response) => setDadosEspacos(response.data))
            .catch((err) => console.error("Erro ao buscar espaços", err));

        axios
            .get('http://localhost:8000/api/user/')
            .then((response) => setDadosUsuarios(response.data))
            .catch((err) => console.error("Erro ao buscar usuários", err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "espaco_id" || name === "usuario_id") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value), 
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
            .post('http://localhost:8000/api/reservas/', formData)
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
                <div
                    className="p-4 rounded border border-dark"
                    style={{
                        backgroundColor: "#f8f9fa",
                        margin: "30px auto",
                        maxWidth: "90%",
                    }}
                >
                    <h1 className="mb-4 text-center">{isEdit ? "Editar Reserva" : "Adicionar Reserva"}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="form-group">
                                    <label htmlFor="usuario_id">Usuário</label>
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
                            </div>

                            <div className="col-12 mb-4">
                                <div className="form-group">
                                    <label htmlFor="espaco_id">Espaço</label>
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
                                                {espaco.nome} - {espaco.localidade}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12 mb-4">
                                <div className="form-group">
                                    <label htmlFor="data">Data</label>
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
                            </div>

                            <div className="col-12 col-md-6 mb-4">
                                <div className="form-group">
                                    <label htmlFor="horario_inicio">Horário de Início</label>
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
                            </div>

                            <div className="col-12 col-md-6 mb-4">
                                <div className="form-group">
                                    <label htmlFor="horario_fim">Horário de Fim</label>
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
                            </div>

                            <div className="col-12 text-center">
                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "17px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </LayoutDashboard>
        </>

    
    );
}
