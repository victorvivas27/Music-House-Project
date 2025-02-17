# integrador-ctd

app de reserva de instrumentos musicales

# DTOs de Entrada

# Clases DTO de Entrada para Usuario, Dirección, Teléfono, Categoría, Temática, Instrumento, Imágenes, Fechas Disponibles y Instrumentos Favoritos

## CategoryDtoEntrance

Esta clase DTO representa los datos de entrada para una categoría en el sistema.

### Atributos

- **categoryName**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 100 caracteres.
    - **Descripción**: Nombre de la categoría.

- **description**: `String`
    - **Longitud**: máximo 1024 caracteres.
    - **Descripción**: Descripción de la categoría.

---

## ThemeDtoEntrance

Esta clase DTO representa los datos de entrada para una temática en el sistema.

### Atributos

- **themeName**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 100 caracteres.
    - **Descripción**: Nombre de la temática.

- **description**: `String`
    - **Longitud**: máximo 1024 caracteres.
    - **Descripción**: Descripción de la temática.

---

## InstrumentDtoEntrance

Esta clase DTO representa los datos de entrada para un instrumento en el sistema.

### Atributos

- **name**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 100 caracteres.
    - **Descripción**: Nombre del instrumento.

- **description**: `String`
    - **Longitud**: máximo 1024 caracteres.
    - **Descripción**: Descripción del instrumento.

- **rentalPrice**: `BigDecimal`
    - **Requerido**: Sí
    - **Restricciones**: Debe ser positivo o cero.
    - **Descripción**: Precio de alquiler del instrumento.

- **weight**: `BigDecimal`
    - **Requerido**: Sí
    - **Restricciones**: Debe ser positivo o cero.
    - **Descripción**: Peso del instrumento.

- **measures**: `String`
    - **Requerido**: Sí
    - **Descripción**: Medidas del instrumento.

- **idCategory**: `Long`
    - **Requerido**: Sí
    - **Descripción**: ID de la categoría a la que pertenece el instrumento.

- **idTheme**: `Long`
    - **Requerido**: Sí
    - **Descripción**: ID de la temática a la que pertenece el instrumento.

- **imageUrls**: `List<String>`
    - **Requerido**: Sí
    - **Descripción**: Lista de URLs de las imágenes del instrumento.

-**characteristic**: CharacteristicDtoEntrance
-**Requerido**: Sí
-**Descripción**: Características del instrumento.

---

## ImageUrlsDtoEntrance

Esta clase DTO representa los datos de entrada para las URLs de las imágenes de un instrumento en el sistema.

### Atributos

- **idInstrument**: `Long`
    - **Requerido**: Sí
    - **Descripción**: ID del instrumento al que pertenece la imagen.

- **imageUrl**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 1024 caracteres.
    - **Descripción**: URL de la imagen.

---

# CharacteristicDtoEntrance

Esta clase DTO representa los datos de entrada para las características de un instrumento musical en el sistema.

## Atributos

- **instrumentCase**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 50 caracteres.
    - **Descripción**: Si el instrumento tiene estuche.

- **support**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 50 caracteres.
    - **Descripción**: Si el instrumento tiene soporte.

- **tuner**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 50 caracteres.
    - **Descripción**: Si el instrumento viene con afinadoor.

- **microphone**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 50 caracteres.
    - **Descripción**: Si el instrumento viene con microfono.

- **phoneHolder**: `String`
    - **Requerido**: Sí
    - **Longitud**: máximo 50 caracteres.
    - **Descripción**: Si el instrumento viene con soprte para celular.

## UserDtoEntrance

Esta clase representa los datos de entrada para un usuario.

### Atributos:

- **name**: String
    - Requerido: Sí
    - Longitud: entre 2 y 50 caracteres
    - Restricciones: solo letras, acentos y espacios

- **lastName**: String
    - Requerido: Sí
    - Longitud: entre 2 y 50 caracteres
    - Restricciones: solo letras, acentos y espacios

- **email**: String
    - Requerido: Sí
    - Formato: email válido

- **password**: String
    - Requerido: Sí
    - Longitud mínima: 6 caracteres

- **addresses**: List<AddressDtoEntrance>
    - Requerido: Sí
    - Descripción: lista de direcciones asociadas al usuario

- **phones**: List<PhoneDtoEntrance>
    - Requerido: Sí
    - Descripción: lista de números de teléfono asociados al usuario

## UserAdminDtoEntrance

Esta clase representa los datos de entrada para un usuario administrador.

### Atributos:

- **name**: String
    - Requerido: Sí
    - Longitud: entre 2 y 50 caracteres

- **lastName**: String
    - Requerido: Sí
    - Longitud: entre 2 y 50 caracteres

- **email**: String
    - Requerido: Sí
    - Formato: email válido

- **password**: String
    - Requerido: Sí
    - Longitud mínima: 6 caracteres

## AddressDtoEntrance

Esta clase representa los datos de entrada para una dirección.

### Atributos:

- **street**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **number**: Long
    - Requerido: Sí
    - Restricciones: número positivo o cero

- **city**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **state**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **country**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

## AddressAddDtoEntrance

Esta clase representa los datos de entrada para agregar una dirección a un usuario.

### Atributos:

- **idUser**: Long
    - Requerido: Sí
    - Descripción: ID del usuario al que se agregará la dirección

- **street**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **number**: Long
    - Requerido: Sí
    - Restricciones: número positivo o cero

- **city**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **state**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

- **country**: String
    - Requerido: Sí
    - Longitud: entre 2 y 100 caracteres
    - Restricciones: solo letras, acentos y espacios

## PhoneDtoEntrance

Esta clase representa los datos de entrada para un número de teléfono.

### Atributos:

- **phoneNumber**: String
    - Requerido: Sí
    - Formato: número de teléfono válido

## PhoneAddDtoEntrance

Esta clase representa los datos de entrada para agregar un número de teléfono a un usuario.

### Atributos:

- **idUser**: Long
    - Requerido: Sí
    - Descripción: ID del usuario al que se agregará el número de teléfono

- **phoneNumber**: String
    - Requerido: Sí
    - Formato: número de teléfono válido

## ChangeOfRole

Esta clase representa los datos de entrada para cambiar el rol de un usuario.

### Atributos:

- **idUser**: Long
    - Requerido: Sí
    - Debe ser un número positivo (mayor que cero)
    - No puede ser nulo
    - Descripción: ID del usuario cuyo rol se va a cambiar

- **rol**: String
    - Requerido: Sí
    - No puede ser nulo
    - Descripción: Nuevo rol que se asignará al usuario

## LoginDtoEntrance

Esta clase representa los datos de entrada para un proceso de inicio de sesión.

### Atributos:

- **email**: String
    - Requerido: Sí
    - No puede ser nulo
    - Debe tener un formato de correo electrónico válido
    - Descripción: Correo electrónico del usuario

- **password**: String
    - Requerido: Sí
    - No puede ser nulo
    - Debe tener al menos 6 caracteres
    - Descripción: Contraseña del usuario

## AvailableDateDtoEntrance

Esta clase representa los datos de entrada para una fecha disponible.

### Atributos:

- **idInstrument**: Long
    - Requerido: Sí
    - No puede ser nulo
    - Descripción: ID del instrumento asociado a la fecha disponible

- **dateAvailable**: LocalDate
    - Requerido: Sí
    - No puede ser nulo
    - Debe ser una fecha futura o la fecha actual
    - Formato: "yyyy-MM-dd"
    - Descripción: Fecha disponible

- **available**: Boolean
    - Requerido: Sí
    - Validaciones:
    - No puede ser nulo
    - Descripción: Disponibilidad del instrumento en la fecha especificada

## FavoriteDtoEntrance

Esta clase representa los datos de entrada para marcar un instrumento como favorito para un usuario.

### Atributos:

- **isFavorite**: Boolean
    - Descripción: Indica si el instrumento es favorito para el usuario

- **idUser**: Long
    - Requerido: Sí
    - No puede ser nulo
    - Descripción: ID del usuario

- **idInstrument**: Long
    - Requerido: Sí
    - No puede ser nulo
    - Descripción: ID del instrumento
   
