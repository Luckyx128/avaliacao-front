
// Função para obter a URL da API baseada no host atual
const getApiUrl = () => {
  const currentHost = window.location.hostname;
  if (currentHost === import.meta.env.VITE_HOST_REDE4 ||
      currentHost === import.meta.env.VITE_HOST_REDE1 ||
      currentHost === import.meta.env.VITE_HOST_REDE0 ||
      currentHost === import.meta.env.VITE_HOST_REDE3) {
    return import.meta.env.VITE_API_URL_REDE1;
  } else if (currentHost === import.meta.env.VITE_HOST_REDE2) {
    return import.meta.env.VITE_API_URL_REDE2;
  }
  // URL padrão para desenvolvimento local
  return import.meta.env.VITE_HOST_API;
};

// Criando instância do axios com a URL base dinâmica
const api = getApiUrl()

export default api; 
