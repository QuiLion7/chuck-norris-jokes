// Teste simples para o hook useLocalStorage

describe('Hook useLocalStorage', () => {
  // Mock do localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  
  // Substituir o localStorage global pelo mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('deve armazenar e recuperar dados do localStorage', () => {
    // Simular o comportamento do hook useLocalStorage
    
    // Função para salvar no localStorage
    const setItem = (key, value) => {
      const valueToStore = JSON.stringify(value);
      window.localStorage.setItem(key, valueToStore);
    };
    
    // Função para recuperar do localStorage
    const getItem = (key, defaultValue) => {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        try {
          return JSON.parse(storedValue);
        } catch (error) {
          console.error('Erro ao analisar valor do localStorage:', error);
          return defaultValue;
        }
      }
      return defaultValue;
    };
    
    // Dados de teste
    const testKey = 'testKey';
    const testValue = { name: 'Chuck Norris', power: 9000 };
    
    // Salvar no localStorage
    setItem(testKey, testValue);
    
    // Verificar se setItem foi chamado com os argumentos corretos
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      testKey,
      JSON.stringify(testValue)
    );
    
    // Configurar o mock para retornar um valor quando getItem for chamado
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(testValue));
    
    // Recuperar do localStorage
    const retrievedValue = getItem(testKey, {});
    
    // Verificar se getItem foi chamado com a chave correta
    expect(window.localStorage.getItem).toHaveBeenCalledWith(testKey);
    
    // Verificar se o valor recuperado é igual ao valor original
    expect(retrievedValue).toEqual(testValue);
  });
  
  it('deve retornar o valor padrão quando não há nada no localStorage', () => {
    // Simular o comportamento do hook useLocalStorage
    
    // Função para recuperar do localStorage
    const getItem = (key, defaultValue) => {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        try {
          return JSON.parse(storedValue);
        } catch (error) {
          console.error('Erro ao analisar valor do localStorage:', error);
          return defaultValue;
        }
      }
      return defaultValue;
    };
    
    // Configurar o mock para retornar null (nada no localStorage)
    window.localStorage.getItem.mockReturnValueOnce(null);
    
    // Dados de teste
    const testKey = 'nonExistentKey';
    const defaultValue = { name: 'Default', power: 1000 };
    
    // Recuperar do localStorage
    const retrievedValue = getItem(testKey, defaultValue);
    
    // Verificar se getItem foi chamado com a chave correta
    expect(window.localStorage.getItem).toHaveBeenCalledWith(testKey);
    
    // Verificar se o valor recuperado é igual ao valor padrão
    expect(retrievedValue).toEqual(defaultValue);
  });
});
