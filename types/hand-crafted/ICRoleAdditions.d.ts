export type ICRole = {
    name: string;
    partner: string | null;
}

export enum ICRoleTypes {
    IC_ROLE_COHOST = "IC_ROLE_COHOST",
    IC_ROLE_CAPTIONER = "IC_ROLE_CAPTIONER",
    IC_ROLE_SIGN_LANG_TRANSLATOR = "IC_ROLE_SIGN_LANG_TRANSLATOR",
    IC_ROLE_ASSISTANT = "IC_ROLE_ASSISTANT",
    IC_ROLE_ASSISTED = "IC_ROLE_ASSISTED"
}