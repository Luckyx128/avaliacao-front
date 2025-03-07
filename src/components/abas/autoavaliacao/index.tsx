import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './style.css';

interface Pergunta {
    id: number;
    pergunta: string;
    assunto: string;
    resposta: number;
}
const Autoavaliacao = ({ setor }: { setor: string }) => {
    const [cookies] = useCookies(['matricula']);
    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const api = import.meta.env.VITE_HOST_API;

    useEffect(() => {
        const fetchPerguntas = async () => {
            try {
                const response = await fetch(`${api}questoes?tipo=2&setor=${setor}`);
                const data = await response.json();
                const perguntas: Pergunta[] = data.data.perguntas;
                setPerguntas(perguntas);
            } catch (error) {
                console.error('Erro ao buscar questões:', error);
            }
        };

        fetchPerguntas();
    }, []);

    const handleRatingChange = (questionId: number, rating: number) => {
        console.log(questionId, rating);
        setPerguntas(perguntas.map(q =>
            q.id === questionId ? { ...q, resposta: rating } : q
        ));
        console.log(perguntas);
    };

    const handleSubmit = async () => {
        try {
            const respostas = perguntas.map(q => ({
                pergunta_id: q.id,
                resposta: q.resposta,
                matricula: cookies.matricula
            }));

            await fetch(`${api}respostas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ respostas })
            });

            alert('Autoavaliação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar respostas:', error);
            alert('Erro ao enviar autoavaliação');
        }
    };

    return (
        <div className="autoavaliacao-container">
            <div className="autoavaliacao-content">

                <h1>Autoavaliação</h1>
                {perguntas.map((pergunta) => (
                    <div key={pergunta.id} className="question-container">
                        <h3>{pergunta.assunto}</h3>
                        <p>{pergunta.pergunta}</p>
                        <div className="rating-buttons">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    className={`rating-button ${pergunta.resposta === rating ? 'selected' : ''}`}
                                    onClick={() => handleRatingChange(pergunta.id, rating)}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
            <div className="autoavaliacao-left-sidebar">
                <p>
                    <span>
                        <h1>Respondidas</h1>
                        <h2>{perguntas.filter(q => q.resposta).length}/{perguntas.length}</h2>
                    </span>
                </p>
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={perguntas.some(q => !q.resposta)}
                >
                    Enviar Autoavaliação
                </button>
            </div>
        </div>
    );
};

export default Autoavaliacao;
