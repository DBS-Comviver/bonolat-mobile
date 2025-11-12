# Mobile Frontend Base

Frontend base escalável e modular para aplicações mobile, construído com React Native, Expo, TypeScript, NativeWind e React Navigation.

## 🚀 Características

- ✅ Arquitetura modular e escalável
- ✅ Autenticação JWT integrada
- ✅ Navegação com React Navigation
- ✅ Estilização com NativeWind (Tailwind CSS)
- ✅ TypeScript para type safety
- ✅ Testes automatizados com Jest
- ✅ Componentes reutilizáveis
- ✅ Layouts modulares (AuthLayout, DefaultLayout)
- ✅ Gerenciamento de estado com Context API
- ✅ Armazenamento local com AsyncStorage
- ✅ Validação e formatação de dados

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (instalado globalmente ou via npx)
- Android Studio (para Android) ou Xcode (para iOS)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd mobile-frontend-base
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

5. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 🎯 Scripts Disponíveis

- `npm start` - Inicia o servidor Expo
- `npm run android` - Inicia no emulador Android
- `npm run ios` - Inicia no simulador iOS
- `npm run web` - Inicia no navegador web
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura de testes
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
mobile-frontend-base/
├── src/
│   ├── App.tsx              # Componente raiz da aplicação
│   ├── core/                # Funcionalidades core
│   │   ├── api/             # Configuração da API (axios, interceptors)
│   │   ├── contexts/        # Contexts (Auth, Theme)
│   │   ├── hooks/           # Hooks customizados (useAuth, useTheme, useFetch)
│   │   ├── services/        # Serviços (storage, validators)
│   │   ├── theme/           # Configuração de tema
│   │   └── utils/           # Utilitários (formatters, masks, validators)
│   ├── modules/             # Módulos da aplicação
│   │   ├── auth/            # Módulo de autenticação
│   │   │   ├── api/         # API calls de autenticação
│   │   │   ├── hooks/       # Hooks de autenticação
│   │   │   ├── screens/     # Telas (Login, Register)
│   │   │   └── types/       # Tipos TypeScript
│   │   └── home/            # Módulo home
│   ├── navigation/          # Configuração de navegação
│   │   ├── RootNavigator.tsx
│   │   ├── AuthRoutes.tsx
│   │   └── AppRoutes.tsx
│   ├── shared/              # Recursos compartilhados
│   │   ├── assets/          # Imagens, ícones, fontes
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── constants/       # Constantes (colors, fonts, metrics)
│   │   └── layouts/         # Layouts (AuthLayout, DefaultLayout)
│   └── types/               # Tipos TypeScript globais
├── global.css               # Estilos globais do Tailwind
├── babel.config.js          # Configuração do Babel
├── metro.config.js          # Configuração do Metro bundler
├── tailwind.config.js       # Configuração do Tailwind CSS
├── jest.config.js           # Configuração do Jest
└── package.json
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: O usuário faz login com username e senha
2. **Token**: O token JWT é armazenado no AsyncStorage
3. **Interceptors**: O token é automaticamente adicionado nas requisições
4. **Navegação**: Baseada no estado de autenticação (AuthRoutes ou AppRoutes)

### Tela de Login

A tela de login utiliza o `AuthLayout` que inclui:
- Logo do cliente no topo
- Campos de usuário e senha
- Botão de entrar
- Logo Comviver na parte inferior

### Exemplo de Uso

```typescript
import { useLogin } from "@modules/auth/hooks/useLogin";

function LoginScreen() {
    const { login, loading, error } = useLogin();
    
    const handleLogin = async () => {
        try {
            await login({ username: "usuario", password: "senha123" });
        } catch (err) {
            console.error("Erro no login:", err);
        }
    };
}
```

## 🧭 Navegação

A navegação é gerenciada pelo React Navigation com duas rotas principais:

- **AuthRoutes**: Rotas para usuários não autenticados (Login, Register)
- **AppRoutes**: Rotas para usuários autenticados (Home, etc.)

O `RootNavigator` alterna automaticamente entre as rotas baseado no estado de autenticação.

### Adicionando Novas Rotas

1. Adicione a rota em `AuthRoutes.tsx` ou `AppRoutes.tsx`:
```typescript
<Stack.Screen name="NewScreen" component={NewScreen} />
```

2. Adicione o tipo em `src/types/navigation.ts`:
```typescript
export type RootStackParamList = {
    // ... outras rotas
    NewScreen: undefined;
};
```

## 🎨 Componentes Compartilhados

### Button

Botão reutilizável com variantes e estados:

```typescript
import { Button } from "@shared/components";

<Button 
    title="Entrar" 
    onPress={handlePress}
    variant="primary" // primary | secondary | outline
    loading={false}
    disabled={false}
/>
```

### Input

Campo de entrada com label, validação e toggle de senha:

```typescript
import { Input } from "@shared/components";

<Input
    label="Usuário"
    placeholder="Digite seu usuário"
    value={value}
    onChangeText={setValue}
    error="Mensagem de erro"
    secureTextEntry={false}
/>
```

### Text

Componente de texto com variantes:

```typescript
import { Text } from "@shared/components";

<Text variant="title">Título</Text>
<Text variant="subtitle">Subtítulo</Text>
<Text variant="caption">Legenda</Text>
```

### Logo

Componente modular para logos:

```typescript
import { Logo } from "@shared/components";

<Logo type="client" />      // Logo do cliente
<Logo type="comviver" />    // Logo Comviver
```

## 🎨 Estilização

O projeto utiliza NativeWind (Tailwind CSS para React Native) para estilização.

### Cores Disponíveis

```typescript
// Cores principais
primary: "#06B6D4"      // Turquesa
secondary: "#9333EA"    // Roxo
auth-dark: "#0A1A2E"    // Azul escuro (fundo de autenticação)

// Escala de cinza
gray-50 até gray-900

// Cores de status
red-400, red-500
green-400, green-500
blue-400, blue-500
```

### Uso de Classes

```typescript
<View className="flex-1 bg-auth-dark items-center justify-center">
    <Text className="text-white text-2xl font-bold">Título</Text>
</View>
```

## 🧪 Testes

Execute os testes:

```bash
npm test
```

Com cobertura:

```bash
npm run test:coverage
```

### Estrutura de Testes

Os testes estão organizados junto aos arquivos que testam:

```
src/
  ├── shared/
  │   └── components/
  │       ├── Button.tsx
  │       └── __tests__/
  │           └── Button.test.tsx
  ├── core/
  │   └── utils/
  │       ├── validators.ts
  │       └── __tests__/
  │           └── validators.test.ts
```

### Exemplo de Teste

```typescript
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button Component", () => {
    it("renders correctly", () => {
        const { getByText } = render(<Button title="Test" />);
        expect(getByText("Test")).toBeTruthy();
    });
});
```

## 📦 Adicionando Novos Módulos

Para adicionar um novo módulo:

1. Crie a estrutura de pastas em `src/modules/`:
```
modules/
└── new-module/
    ├── api/
    ├── hooks/
    ├── screens/
    ├── types/
    └── index.ts
```

2. Crie as rotas em `AuthRoutes.tsx` ou `AppRoutes.tsx`

3. Crie os testes em `src/modules/new-module/__tests__/`

## 🔒 Segurança

- **Tokens JWT**: Armazenados de forma segura no AsyncStorage
- **Interceptors**: Token adicionado automaticamente nas requisições
- **Validação**: Validação de dados no frontend
- **Tratamento de erros**: Tratamento centralizado de erros da API
- **Logout automático**: Logout automático em caso de token inválido (401)

## 🌐 Variáveis de Ambiente

### Exemplo de Arquivo .env

```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

### Tabela de Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `EXPO_PUBLIC_API_URL` | URL da API backend | `http://localhost:3333` | Não |

**Nota**: Variáveis que começam com `EXPO_PUBLIC_` são expostas ao código JavaScript.

## 🎯 Utilitários

### Formatters

```typescript
import { formatters } from "@core/utils";

formatters.currency(1000);           // "R$ 1.000,00"
formatters.date(new Date());        // "15/01/2024"
formatters.time(new Date());        // "10:30"
formatters.phone("11987654321");    // "(11) 98765-4321"
```

### Masks

```typescript
import { masks } from "@core/utils";

masks.cpf("12345678909");          // "123.456.789-09"
masks.cnpj("12345678000190");       // "12.345.678/0001-90"
masks.phone("11987654321");         // "(11) 98765-4321"
masks.cep("12345678");              // "12345-678"
```

### Validators

```typescript
import { validators } from "@core/utils";

validators.cpf("12345678909");      // true
validators.email("test@example.com"); // true
validators.phone("11987654321");    // true
validators.cep("12345678");          // true
```

## 📱 Layouts

### AuthLayout

Layout padrão para telas de autenticação:

- Fundo azul escuro
- Logo do cliente no topo
- Área central para conteúdo
- Logo Comviver na parte inferior

```typescript
import { AuthLayout } from "@shared/layouts/AuthLayout";

<AuthLayout>
    {/* Conteúdo da tela */}
</AuthLayout>
```

### DefaultLayout

Layout padrão para telas autenticadas:

- Suporte a tema claro/escuro
- SafeAreaView integrado

```typescript
import { DefaultLayout } from "@shared/layouts/DefaultLayout";

<DefaultLayout>
    {/* Conteúdo da tela */}
</DefaultLayout>
```

## 🎨 Tema

O projeto suporta temas claro e escuro:

```typescript
import { useTheme } from "@core/hooks/useTheme";

function MyComponent() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <View>
            <Text>Tema atual: {theme}</Text>
            <Button title="Alternar tema" onPress={toggleTheme} />
        </View>
    );
}
```

## 📝 Licença

ISC

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório.
