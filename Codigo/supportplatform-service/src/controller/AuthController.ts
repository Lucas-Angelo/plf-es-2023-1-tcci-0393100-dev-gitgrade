import { Controller, Example, Get, Route, Tags } from "tsoa";
import EnvConfig from "../config/EnvConfig";
import { GetPublicKeyResponseDTO } from "@gitgrade/dtos";

@Route("auth")
@Tags("auth")
export class AuthController extends Controller {
    @Get("public-key")
    @Example<GetPublicKeyResponseDTO>({
        publicKey:
            "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn2fmVWFPteAviIyPDI6Y\nYqvYpqDf8Sr4rcCjVc1eBPXwhc8V9ybxc/9ajlWLD9AG9hmtnZQKRhA+2Gqjar9M\n3XHSW0Q7uAmrUudT8mx31w/0lhx0lzbDzCIPY46Avk7ptjKc2SDbEOmKGg7CgqND\nYd3OWV96SCJSuWudXHpGOZRqztXyQVrJ0200bLgL/e1SdspV7FheIJvqgWonTHnv\n0WOzhn7WyiiOkTtmYiktk9W/tSO8vhaAK/GWgTwcX0HzUaabE599itZAMDLWlM2I\nt/SebZkZ5URzuLDakkWUYPb0Hj1B3Jmon6WGRJ6bRRkKdObWT5OaEEtnmrdmKNuN\nGwIDAQAB\n-----END PUBLIC KEY-----",
    })
    getPublicKey(): GetPublicKeyResponseDTO {
        this.setStatus(200);
        return { publicKey: EnvConfig.JWT_PUBLIC_KEY };
    }
}
