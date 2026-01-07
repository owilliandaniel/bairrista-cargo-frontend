import React, { useState } from 'react'
import '../../components/AreaCliente.css'

const AnimatedCreditCard = ({ cardData, isFlipped }) => {
  const formatCardNumber = (number) => {
    if (!number) return '•••• •••• •••• ••••'
    const cleaned = number.replace(/\s/g, '')
    const formatted = cleaned.padEnd(16, '•').match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••'
    return formatted
  }

  const renderCardLogo = (brandName) => {
    switch(brandName) {
      case 'NUBANK':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '4px', 
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              color: '#820ad1',
              fontSize: '1.2rem',
              letterSpacing: '1px'
            }}>
              nu
            </div>
          </div>
        )
      case 'VISA':
        return (
          <div style={{ 
            fontWeight: 900,
            fontSize: '2.2rem',
            fontStyle: 'italic',
            color: 'white',
            letterSpacing: '-1px'
          }}>
            VISA
          </div>
        )
      case 'MASTERCARD':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: '#eb001b',
              opacity: 0.9
            }} />
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: '#f79e1b',
              marginLeft: '-16px',
              opacity: 0.9
            }} />
          </div>
        )
      case 'ELO':
        return (
          <div style={{ 
            fontWeight: 900,
            fontSize: '2rem',
            background: '#ffcb05',
            padding: '4px 12px',
            borderRadius: '4px',
            color: '#000'
          }}>
            elo
          </div>
        )
      default:
        return (
          <div style={{ 
            fontWeight: 800,
            fontSize: '1.8rem',
            fontStyle: 'italic',
            color: 'white'
          }}>
            {brandName}
          </div>
        )
    }
  }

  const detectCardBrand = (number) => {
    if (!number) return { name: 'CARD', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    
    const cleaned = number.replace(/\s/g, '')
    
    if (/^(5502|5269|5270|5537)/.test(cleaned)) {
      return { name: 'NUBANK', gradient: 'linear-gradient(135deg, #820ad1 0%, #a01ae3 100%)' }
    }
    
    if (/^4/.test(cleaned)) {
      return { name: 'VISA', gradient: 'linear-gradient(135deg, #1a1f71 0%, #2e3a8c 100%)' }
    }
    
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
      return { name: 'MASTERCARD', gradient: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)' }
    }
    
    if (/^(4011|4312|4389|4514|4576|5041|5066|5067|6277|636[23]|650[45]|6516|6550)/.test(cleaned)) {
      return { name: 'ELO', gradient: 'linear-gradient(135deg, #ffcb05 0%, #000000 100%)' }
    }
    
    return { name: 'CARD', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  }

  const brandInfo = detectCardBrand(cardData.number)
  
  return (
    <div className="credit-card-container" style={{ perspective: '1000px', marginBottom: '2rem' }}>
      <div className={`credit-card-flipper ${isFlipped ? 'flipped' : ''}`} style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        height: '240px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        <div className="credit-card-front" style={{ 
          background: brandInfo.gradient,
          borderRadius: '20px',
          padding: '28px',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="cc-chip" style={{
              width: '50px',
              height: '40px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
              borderRadius: '8px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}></div>
            {renderCardLogo(brandInfo.name)}
          </div>
          <div style={{ 
            fontSize: '1.6rem',
            letterSpacing: '4px',
            fontFamily: '"Courier New", monospace',
            fontWeight: 500
          }}>
            {formatCardNumber(cardData.number)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>Nome no Cartão</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {cardData.holder || 'SEU NOME'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>Validade</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{cardData.expiry || 'MM/AA'}</div>
            </div>
          </div>
        </div>

        <div className="credit-card-back" style={{
          background: brandInfo.gradient,
          borderRadius: '20px',
          padding: '28px',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            height: '50px',
            background: '#000',
            margin: '0 -28px',
            marginTop: '20px'
          }}></div>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '10px',
            borderRadius: '4px',
            textAlign: 'right',
            color: '#000',
            fontFamily: '"Courier New", monospace',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {cardData.cvv || '•••'}
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.8, textAlign: 'center', marginTop: '20px' }}>
            Este cartão é propriedade do titular identificado na frente.
          </div>
        </div>
      </div>
    </div>
  )
}

function Pagamentos({ cards, setCards }) {
  const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '', cvv: '' })
  const [showCardForm, setShowCardForm] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'number') {
      const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 16)
      setNewCard({ ...newCard, [name]: sanitizedValue })
    } else if (name === 'expiry') {
      const onlyNums = value.replace(/[^0-9]/g, '')
      if (onlyNums.length <= 2) {
        setNewCard({ ...newCard, [name]: onlyNums })
      } else {
        const formatted = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`
        setNewCard({ ...newCard, [name]: formatted })
      }
    } else if (name === 'cvv') {
      const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 4)
      setNewCard({ ...newCard, [name]: sanitizedValue })
    } else if (name === 'holder') {
      setNewCard({ ...newCard, [name]: value.toUpperCase() })
    } else {
      setNewCard({ ...newCard, [name]: value })
    }
  }

  const detectCardBrand = (number) => {
    if (!number) return 'Card'
    
    const cleaned = number.replace(/\s/g, '')
    
    if (/^(5502|5269|5270|5537)/.test(cleaned)) return 'Nubank'
    if (/^4/.test(cleaned)) return 'Visa'
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard'
    if (/^3[47]/.test(cleaned)) return 'Amex'
    if (/^(4011|4312|4389|4514|4576|5041|5066|5067|6277|636[23]|650[45]|6516|6550)/.test(cleaned)) return 'Elo'
    
    return 'Card'
  }

  const handleAddCard = (e) => {
    e.preventDefault()
    
    if (!newCard.number || newCard.number.length < 13) {
      alert('Por favor, insira um número de cartão válido (mínimo 13 dígitos).')
      return
    }
    if (!newCard.holder) {
      alert('Por favor, insira o nome no cartão.')
      return
    }
    if (!newCard.expiry || newCard.expiry.length < 5) {
      alert('Por favor, insira a validade no formato MM/AA.')
      return
    }
    if (!newCard.cvv || newCard.cvv.length < 3) {
      alert('Por favor, insira um CVV válido (3 ou 4 dígitos).')
      return
    }

    const newCardData = {
      id: Date.now(),
      final: newCard.number.slice(-4),
      brand: detectCardBrand(newCard.number),
      holder: newCard.holder,
      expiry: newCard.expiry,
      default: cards.length === 0
    }
    
    setCards([...cards, newCardData])
    setShowCardForm(false)
    setNewCard({ number: '', holder: '', expiry: '', cvv: '' })
    setFocusedInput(null)
  }

  const handleDeleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId)
    setCards(updatedCards)
  }

  const handleSetDefault = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      default: card.id === cardId
    })))
  }

  const getCardGradient = (brand) => {
    const brandLower = brand.toLowerCase()
    if (brandLower === 'visa') return 'linear-gradient(135deg, #1a1f71 0%, #2e3a8c 100%)'
    if (brandLower === 'mastercard') return 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)'
    if (brandLower === 'nubank') return 'linear-gradient(135deg, #820ad1 0%, #a01ae3 100%)'
    if (brandLower === 'elo') return 'linear-gradient(135deg, #ffcb05 0%, #000000 100%)'
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }

  return (
    <div className="fade-in">
      <h2 className="mb-2">Carteira e Pagamentos</h2>
      
      {cards.find(card => card.default) && (() => {
        const defaultCard = cards.find(card => card.default)
        return (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>Cartão Padrão</h3>
            <div style={{ 
              background: getCardGradient(defaultCard.brand),
              borderRadius: '20px',
              padding: '28px',
              color: 'white',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '50px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                  borderRadius: '8px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
                <div style={{ 
                  fontWeight: 800,
                  fontSize: '1.8rem',
                  fontStyle: 'italic'
                }}>
                  {defaultCard.brand.toUpperCase()}
                </div>
              </div>
              <div style={{ 
                fontSize: '1.6rem',
                letterSpacing: '4px',
                fontFamily: '"Courier New", monospace',
                fontWeight: 500
              }}>
                •••• •••• •••• {defaultCard.final}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>Nome no Cartão</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {defaultCard.holder}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>Validade</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{defaultCard.expiry}</div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      <button 
        className="btn-primary" 
        onClick={() => setShowCardForm(true)}
        style={{ marginBottom: '2rem' }}
      >
        + Adicionar Novo Cartão
      </button>

      {cards.length > 0 && (
        <div className="content-box">
          <h3>Cartões Salvos</h3>
          <div style={{ marginTop: '1rem' }}>
            {cards.map(card => (
              <div key={card.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {card.brand} •••• {card.final}
                    {card.default && <span style={{ 
                      background: '#ffd700', 
                      color: '#000', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      marginLeft: '10px',
                      fontWeight: 'bold'
                    }}>★ Padrão</span>}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>
                    {card.holder}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!card.default && (
                    <button 
                      className="btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Definir Padrão
                    </button>
                  )}
                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '6px 12px', color: '#f44336' }}
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCardForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Adicionar Novo Cartão</h3>
            
            <AnimatedCreditCard 
              cardData={newCard}
              isFlipped={focusedInput === 'cvv'}
            />

            <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                name="number"
                placeholder="Número do Cartão" 
                value={newCard.number.replace(/(.{4})/g, '$1 ').trim()}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('number')}
                onBlur={() => setFocusedInput(null)}
                maxLength="19"
                required 
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '2px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none',
                  borderColor: focusedInput === 'number' ? '#667eea' : '#ddd'
                }}
              />
              <input 
                type="text" 
                name="holder"
                placeholder="Nome no Cartão" 
                value={newCard.holder}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('holder')}
                onBlur={() => setFocusedInput(null)}
                required 
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '2px solid #ddd',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  outline: 'none',
                  borderColor: focusedInput === 'holder' ? '#667eea' : '#ddd'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  name="expiry"
                  placeholder="MM/AA" 
                  value={newCard.expiry}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('expiry')}
                  onBlur={() => setFocusedInput(null)}
                  maxLength="5"
                  required 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '6px', 
                    border: '2px solid #ddd', 
                    flex: 1,
                    fontSize: '1rem',
                    outline: 'none',
                    borderColor: focusedInput === 'expiry' ? '#667eea' : '#ddd'
                  }}
                />
                <input 
                  type="text" 
                  name="cvv"
                  placeholder="CVV" 
                  value={newCard.cvv}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('cvv')}
                  onBlur={() => setFocusedInput(null)}
                  maxLength="4"
                  required 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '6px', 
                    border: '2px solid #ddd', 
                    flex: 1,
                    fontSize: '1rem',
                    outline: 'none',
                    borderColor: focusedInput === 'cvv' ? '#667eea' : '#ddd'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowCardForm(false)
                    setNewCard({ number: '', holder: '', expiry: '', cvv: '' })
                    setFocusedInput(null)
                  }}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagamentos
