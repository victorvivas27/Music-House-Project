package com.musichouse.api.music.controller;

/*@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/auths")
public class AuthController {
    private final static Logger LOGGER = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<TokenDtoExit>> createUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) List<MultipartFile> files
    ) throws JsonProcessingException, MessagingException {


        // 📌 1️⃣ Convertir el JSON String a un objeto UserDtoEntrance
        UserDtoEntrance userDtoEntrance = objectMapper.readValue(userJson, UserDtoEntrance.class);

        // 2. Validar archivos subidos
        List<String> fileErrors = FileValidatorUtils.validateImages(files);

        // 3. Validar DTO manualmente (porque viene como JSON string)
        Set<ConstraintViolation<UserDtoEntrance>> violations = validator.validate(userDtoEntrance);
        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        // 4. Unificar errores
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }

        // 5. Crear usuario
        TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, files);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TokenDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Usuario creado con éxito.")
                        .error(null)
                        .result(tokenDtoExit)
                        .build());

    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDtoExit>> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance) {
        try {
            TokenDtoExit tokenDtoExit = userService.loginUserAndCheckEmail(loginDtoEntrance);

            return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Inicio de sesión exitoso.")
                    .error(null)
                    .result(tokenDtoExit)
                    .build());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("Usuario no encontrado.")
                            .error(e.getMessage())
                            .result(null)
                            .build());

        } catch (AuthenticationException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Autenticación fallida. Verifique sus credenciales.")
                            .error(e.getMessage())
                            .result(null)
                            .build());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }
}*/
