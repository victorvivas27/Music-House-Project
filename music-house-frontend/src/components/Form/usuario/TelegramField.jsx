import { ParagraphResponsive } from "@/components/styles/ResponsiveComponents"
import { flexRowContainer, inputStyles, inputWidth } from "@/components/styles/styleglobal"
import { Box, FormControl, TextField } from "@mui/material"
import { ErrorMessage, Field } from "formik"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

export const TelegramField = ({ values, touched, errors }) => {
    return (
      <Box sx={{
        border:"solid 1px red",
       ...inputWidth,
       ...flexRowContainer
        }}>
        <FormControl sx={{...inputStyles , mt: 2  }}>
          <Field
            as={TextField}
            name="telegramChatId"
            label="🔢Código de Telegram"
            type="text"
            value={values.telegramChatId}
            error={touched.telegramChatId && Boolean(errors.telegramChatId)}
            helperText={<ErrorMessage name="telegramChatId" />}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />
        </FormControl>
  
        <ParagraphResponsive>
          ¿No sabes tu código?{' '}
          <Link
            href="https://t.me/MyBotJva_bot"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 'bold', color: 'var(--color-azul)' }}
          >
            Haz clic aquí para obtenerlo en Telegram
          </Link>
        </ParagraphResponsive>
      </Box>
    )
  }
  
  TelegramField.propTypes = {
    values: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  }