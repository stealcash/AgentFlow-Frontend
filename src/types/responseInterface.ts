
export type Profile = {
    email: string;
    company: string;
    user_type: 'admin' | 'editor' | 'superadmin';
};


export type Chatbot = {
    id: number;
    chatbot_name?: string;
    name?:string
    [key: string]: unknown;
};

export type ChatBotResponse = {
    chatbots: Chatbot[]
    [key: string]: unknown;
}



export interface ProfileResponse {
   user: Profile & {
        chatbots: Chatbot[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}