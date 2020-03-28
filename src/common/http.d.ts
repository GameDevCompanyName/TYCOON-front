export declare module http {
    function getRequest(url: string, withCredentials: boolean): Promise<any>;
    function postRequest(url: string, parameters: FormData, withCredentials: boolean): Promise<any>;
    function contentOfPostRequest(url: string, parameters: FormData, withCredentials: boolean, handler: Function): void;
    function contentOfGetRequest(url: string, withCredentials: boolean, handler: Function): void;
    function getEntity(url: string, handler: Function): void;
}
